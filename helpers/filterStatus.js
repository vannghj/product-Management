module.exports = (query) => {
    let filterStatus = [
        {
            name: "Tat ca",
            status: "",
            class: ""
        },
        {
            name: "Hoat dong",
            status: "active",
            class: ""
        },
        {
            name: "Dung hoat dong",
            status: "inactive",
            class: ""
        }
    ];
    if(query.status) {
        const index = filterStatus.findIndex(item => item.status == query.status);
        filterStatus[index].class = "active";
    } else {
        filterStatus[0].class = "active";
    }
    return filterStatus;
}