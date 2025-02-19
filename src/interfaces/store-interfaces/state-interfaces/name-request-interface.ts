import { CorpTypeCd, NameRequestStates } from '@/enums'

/** Name request response details interface. */
export interface NameRequestDetailsIF {
  approvedName: string
  status: NameRequestStates
  consentFlag: string
  expirationDate: string
}

/** Name request applicant details interface. */
export interface NameRequestApplicantIF {
  firstName: string
  middleName: string
  lastName: string
  emailAddress: string
  phoneNumber: string
  addressLine1: string
  addressLine2: string
  addressLine3: string
  city: string
  countryTypeCode: string
  postalCode: string
  stateProvinceCode: string
}

/** Name Request state interface. */
export interface NameRequestIF {
  nrNumber: string
  entityType: CorpTypeCd
  details: NameRequestDetailsIF | {}
  applicant: NameRequestApplicantIF | {}
  filingId: number
}

// NB: use cloneDeep when assigning EmptyOrgPerson
export const EmptyNameRequest: NameRequestIF = {
  nrNumber: '',
  entityType: null,
  details: {},
  applicant: {},
  filingId: null
}
