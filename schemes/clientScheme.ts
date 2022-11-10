import * as yup from 'yup';

export const ClientScheme = yup.object({
    id: yup.number().optional(),
    first_name: yup.string().required().max(100).min(3),
    last_name: yup.string().required().max(100).min(3),
    address: yup.string().required().min(2).max(100),
    creation_date: yup.date().optional()
});
