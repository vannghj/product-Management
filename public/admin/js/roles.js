//permissions
const tablePermisstion = document.querySelector("[table-permisstion]");
if(tablePermisstion) {
    const buttonSubmit = document.querySelector("[button-submit]");
    buttonSubmit.addEventListener("click", () => {
        let permisstions = [];

        const rows = tablePermisstion.querySelectorAll("[data-name]");
        rows.forEach(row  => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");
            if(name == "id") {
                inputs.forEach(input => {
                    const id = input.value;
                    permisstions.push({
                        id: id,
                        permisstions: []
                    });
                });
            }else {
                inputs.forEach((input,index) => {
                    const checked = input.checked;
                    if(checked) {
                        permisstions[index].permisstions.push(name);
                    }
                })
            }

        });
        if(permisstions.length > 0) {
            const formChangePermissions = document.querySelector("#form-change-permissions");
            const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");
            inputPermissions.value = JSON.stringify(permisstions);
            formChangePermissions.submit();
        }
    });
}
//end permissions

//permissions data default
const dataRecords = document.querySelector("[data-records]")
if(dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    const tablePermissions = document.querySelector("[table-permisstion]");
    records.forEach((record,index) => {
        const permissions = record.permissions;
        permissions.forEach(permission => {
            const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
            const input = row.querySelectorAll("input")[index];
            input.checked = true;
        })
    })
}
//end