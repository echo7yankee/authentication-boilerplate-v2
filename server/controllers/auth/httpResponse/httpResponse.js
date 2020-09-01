class HttpResponse {
    constructor() {

        this.buildSuccess = this.buildSuccess.bind(this);
        this.buildFail = this.buildFail.bind(this);
    }

    buildSuccess(res, httpCode, data) {
        return res.status(httpCode).json({
            ...data,
            httpCode,
            status: 'Success'
        });
    }

    buildFail(res, httpCode, data) {
        return res.status(httpCode).json({
            ...data,
            httpCode,
            status: 'Fail',
        });
    }
}

module.exports = { HttpResponse }