// test.js
import request from 'supertest';
import { expect } from 'chai';
import config from '../helpers/config.js';
import { printConfig } from '../helpers/debugHelper.js';

describe('Dashboard API Tests', function() {
	printConfig(); // Set debug level in ../helpers/debugHelper.js to display config data at runtime.
	this.timeout(config.timeout);
	let kc_access_token, invoice_date;
	let org_slug = 'test';
  
	it('GET {{host}}/dashboard/api/v1/public-config', function() {
		return request(config.host)
        .get('/dashboard/api/v1/public-config')
        .expect(200)
        .then(response => {
          	expect(response.body).to.be.an('object');
          	expect(response.body).to.have.property('cdnOriginUrl');
          	expect(response.body).to.have.property('clientId');
          	expect(response.body).to.have.property('freeMinutesLimit');
          	expect(response.body).to.have.property('globalHostUrl');
          	expect(response.body).to.have.property('isPrivateCloud');
          	expect(response.body).to.have.property('jwksUrl');
          	expect(response.body).to.have.property('keycloakUrl');
          	expect(response.body).to.have.property('mixpanelProjectToken');
          	expect(response.body).to.have.property('statsHost');
          	expect(response.body).to.have.property('stripePublishableKey');
          	expect(response.body).to.have.property('stripePublishableKeyDev');
        });
    });

	it('POST {{kc_host}}/auth/realms/{{kc_realm}}/protocol/openid-connect/token', function () {
		const body = {
			client_id: 'test_runner',
			client_secret: 'ejtJzbLoyzZT9ptIuqSKbHuX3LJdp9d2',
			username: 'qatester1@livelyvideo.tv',
			password: 'cpPGrA%8PSVth3',
			grant_type: 'password',
		};

		return request(config.kc_host)
        .post(`/auth/realms/${config.kc_realm}/protocol/openid-connect/token`)
        .type('form') // This request requires an encoded URL.
        .send(body)
        .expect(200)
        .then(response => {
        	kc_access_token = response.body.access_token;
        	expect(response.body).to.be.an('object');
          	expect(response.body).to.have.property('access_token');
          	expect(response.body.access_token).to.not.be.null;
          	expect(response.body).to.have.property('expires_in');
          	expect(response.body.expires_in).to.equal(300);
          	expect(response.body).to.have.property('refresh_expires_in');
          	expect(response.body.refresh_expires_in).to.equal(604800);
          	expect(response.body).to.have.property('refresh_token');
          	expect(response.body.refresh_token).to.not.be.null;
          	expect(response.body).to.have.property('token_type');
          	expect(response.body.token_type).to.equal('Bearer');
          	expect(response.body).to.have.property('session_state');
          	expect(response.body.session_state).to.not.be.null;
          	expect(response.body).to.have.property('scope');
          	expect(response.body.scope).to.equal('email profile');
        });
    });

    it('GET {{dashboard_host}}/dashboard/api/v1/organizations/{{org_slug}}/invoices/dates', function() {
    	return request(config.dashboard_host)
    	.get(`/dashboard/api/v1/organizations/${org_slug}/invoices/dates`)
    	.set('Authorization', `Bearer ${kc_access_token}`)
    	.expect(200)
    	.then(response => {
    		invoice_date = response.body[0].date
          	expect(response.body).to.be.an('array').that.is.not.empty;
          	response.body.forEach(item => {
          		expect(item).to.be.an('object');
          		expect(item).to.have.property('date');
          		expect(item.date).to.be.a('string');
          		expect(item.date).to.match(/^\d{4}-\d{2}$/);
          	});
    	});
    });

    it('GET {{dashboard_host}}/dashboard/api/v1/organizations/{{org_slug}}/invoices/{{year_month}}', function() {
    	return request(config.dashboard_host)
    	.get(`/dashboard/api/v1/organizations/${org_slug}/invoices/${invoice_date}`)
    	.set('Authorization', `Bearer ${kc_access_token}`)
    	.expect(200)
    	.then(response => {
    		expect(response.body).to.be.an('array').that.is.not.empty;
			response.body.forEach(item => {
	    		expect(item).to.have.property('projectId');
	    		expect(item.projectId).to.not.be.null;
	    		expect(item).to.have.property('projectName');
	    		expect(item).to.have.property('minutesStreamed');
	    		expect(item).to.have.property('streamPrice');
	    		expect(item).to.have.property('minutesViewed');
	    		expect(item).to.have.property('viewPrice');
	    		expect(item).to.have.property('totalCost');
    		});
    	});
    });

    it('GET {{dashboard_host}}/dashboard/api/v1/organizations/{{org_slug}}/invoices/{{year_month}}/totals', function() {
    	return request(config.dashboard_host)
    	.get(`/dashboard/api/v1/organizations/${org_slug}/invoices/${invoice_date}/totals`)
    	.set('Authorization', `Bearer ${kc_access_token}`)
    	.expect(200)
    	.then(response => {
    		expect(response.body).to.be.an('object');
    		expect(response.body).to.have.property('view');
    		expect(response.body.view).to.equal(0);
    		expect(response.body).to.have.property('stream');
    		expect(response.body.stream).to.be.gt(0);
    		expect(response.body).to.have.property('cost');
    		expect(response.body.cost).to.be.gt(0);
    	});
    });

    it('GET {{dashboard_host}}/dashboard/api/v1/organizations/{{org_slug}}/invoices/history', function() {
    	return request(config.dashboard_host)
    	.get(`/dashboard/api/v1/organizations/${org_slug}/invoices/history`)
    	.set('Authorization', `Bearer ${kc_access_token}`)
    	.expect(200)
    	.then(response => {
    		expect(response.body).to.be.an('array').that.is.not.empty;
    		response.body.forEach(item => {
				expect(item).to.be.an('object');
				expect(item).to.have.property('id').that.is.a('string');
				expect(item).to.have.property('date').that.is.a('string');
				expect(item).to.have.property('paid').that.is.a('number');
				expect(item).to.have.property('stripeInvoiceId').that.is.a('string');
				expect(item).to.have.property('organizationId').that.is.a('string');
				expect(item).to.have.property('invoicePdf').that.is.a('string');
				expect(item).to.have.property('stripeStatus').that.is.a('string');
				expect(item).to.have.property('totalCents').that.is.a('number');
    		});
    	});
    });

	it('GET {{dashboard_host}}/dashboard/api/v1/organizations/{{org_slug}}/invoices/download-all', function() {
		this.timeout(15000); // This request takes a long time to complete.
		return request(config.dashboard_host)
		.get(`/dashboard/api/v1/organizations/${org_slug}/invoices/download-all`)
		.set('Authorization', `Bearer ${kc_access_token}`)
		.expect(200)
		.then(response => {
			expect(response.body).to.be.an('object');
		});
	});

	it('GET {{dashboard_host}}/dashboard/api/v1/users/{{kc_user_id}}', function() {
		return request(config.dashboard_host)
		.get(`/dashboard/api/v1/users/${config.kc_userId}`)
		.set('Authorization', `Bearer ${kc_access_token}`)
		.expect(200)
		.then(response => {
			expect(response.body).to.be.an('object');
			expect(response.body).to.have.property('id');
			expect(response.body.id).to.not.be.null;
			expect(response.body).to.have.property('username');
			expect(response.body.username).to.equal('qatester1@livelyvideo.tv');
			expect(response.body).to.have.property('firstName');
			expect(response.body.firstName).to.equal('qatester');
			expect(response.body).to.have.property('lastName');
			expect(response.body.lastName).to.equal('1');
		});
	});
});

























