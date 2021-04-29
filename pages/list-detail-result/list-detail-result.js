Page({
    data: {
        rate: 0,
        count: 0
    },
    onLoad(options) {
        this.setData({
            rate: options.rate,
            count: options.count
        });
    },
    onShareAppMessage: function () {
        return {
            path: "/pages/index/index"
        };
    }
});