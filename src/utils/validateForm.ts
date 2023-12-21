import * as yup from 'yup';

export async function validateForm(
	form: Record<string, unknown>,
	schema: yup.ObjectSchema<yup.AnyObject>
) {
	let errors = {};
	try {
		await schema.validate(form, { abortEarly: false });
	} catch (err) {
		if (err instanceof yup.ValidationError) {
			errors = err.inner.reduce((errors: Record<string, string>, err: yup.ValidationError) => {
				const path = err.path || '';
				return { ...errors, [path]: err.message };
			}, {});
		}
	}
	return errors;
}
