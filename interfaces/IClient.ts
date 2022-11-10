export default interface IClient extends Document {
    id?: number,
    first_name: string,
    last_name: string,
    address: string,
    creation_date?: Date,
}
