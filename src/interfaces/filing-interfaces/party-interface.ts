import { AddressIF, RolesIF } from '@/interfaces'
import { PartyTypes } from '@/enums'

//
// Interfaces for exchanging Party (aka OrgPerson) with the API.
// Ref: https://github.com/bcgov/business-schemas/blob/main/src/registry_schemas/schemas/party.json
//

/** Similar to OfficerIF except businessNumber <-> taxId. */
export interface ApiPersonIF {
  id?: string // used by UI only
  partyType: PartyTypes
  firstName: string
  middleName?: string
  lastName: string
  organizationName: string
  email?: string
  taxId?: string // aka Business Number
}

/** Similar to OrgPersonIF except OfficerIF <-> ApiPersonIF. */
export interface PartyIF {
  officer: ApiPersonIF
  roles: RolesIF[]
  mailingAddress: AddressIF
  deliveryAddress?: AddressIF
  inheritMailingAddress?: boolean // used by UI only
  confirmBusiness?: boolean // used by UI only
}
