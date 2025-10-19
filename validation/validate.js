export const validate = (schema, source = 'body') => (req, res, next) => {
    const input = source === 'query' ? req.query : req[source];
    const parsed = schema.safeParse(input);

    if (!parsed.success) {
        return res.status(400).json({
            error: 'Validation failed',
            details: parsed.error.flatten(),
        });
    }

    if (source === 'query') {
        req.validatedQuery = parsed.data;
    } else {
        req[source] = parsed.data;
    }

    return next();
}
