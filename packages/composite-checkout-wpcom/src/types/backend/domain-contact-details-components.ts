/*
 * The data model used in ContactDetailsFormFields and related components.
 * This belongs in components/domains/contact-details-form-fields, but until
 * that component is rewritten in TypeScript we'll put it here.
 *
 * @see components/domains/contact-details-form-fields
 * @see components/domains/registrant-extra-info
 */

export type DomainContactDetails = {
	firstName: string;
	lastName: string;
	organization: string;
	email: string;
	alternateEmail: string;
	phone: string;
	address1: string;
	address2: string;
	city: string;
	state: string;
	postalCode: string;
	countryCode: string;
	fax: string;
};

export type DomainContactDetailsErrors = {
	firstName?: string;
	lastName?: string;
	organization?: string;
	email?: string;
	alternateEmail?: string;
	phone?: string;
	address1?: string;
	address2?: string;
	city?: string;
	state?: string;
	postalCode?: string;
	countryCode?: string;
	fax?: string;
};

export type CaDomainContactExtraDetails = {
	lang: string;
	legal_type: string;
	cira_agreement_accepted: boolean;
};

export type CaDomainContactExtraDetailsErrors = {
	lang?: string;
	legal_type?: string;
	cira_agreement_accepted?: string;
};

export type UkDomainContactExtraDetails = {
	registrant_type: string;
	registration_number: string;
	trading_name: string;
};

export type UkDomainContactExtraDetailsErrors = {
	registrant_type?: string;
	registration_number?: string;
	trading_name?: string;
};

export type FrDomainContactExtraDetails = {
	registrant_type: string;
	trademark_number: string;
	siren_sirat: string;
};

export type FrDomainContactExtraDetailsErrors = {
	registrant_type?: string;
	trademark_number?: string;
	siren_sirat?: string;
};
