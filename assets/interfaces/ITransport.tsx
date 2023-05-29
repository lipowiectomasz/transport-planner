import ILoad from "./ILoad"

export default interface ITransport{
    "transport-from" : string,
    "transport-to" : string,
    "plane-type" : string,
    "transport-docs" : File[],
    "transport-date" : string,
    "transport-loads" : ILoad[]
}