// Account information interface
export interface OrgInformationIF {
  branchName: string
  id: number
  mailingAddress: any // not the same as AddressIF
  // NB: there are other fields but we don't need them
}
