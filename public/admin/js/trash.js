// change status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");
    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");
            let statusChange = statusCurrent == "active" ? "inactive" : "active";
            const action = path + `/${statusChange}/${id}?_method=PATCH`;
            formChangeStatus.action = action;
            formChangeStatus.submit();
        });
    });
}
// end change status

//delete item
const buttonDelete = document.querySelectorAll("[button-delete]");
if(buttonDelete.length > 0) {
    const formDeteleItem = document.querySelector("#form-delete-item");
    const path = formDeteleItem.getAttribute("data-path");
    buttonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("ban co chac muon xoa vinh vien san pham nay ?");
            if(isConfirm) {
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;
                formDeteleItem.action = action;
                formDeteleItem.submit();
            }
        })
    })
}
// end delete item
// revive item
const buttonRevive = document.querySelectorAll("[button-revive]");
console.log(buttonRevive);
if(buttonRevive.length > 0) {
    const formReviveItem = document.querySelector("#form-revive-item");
    const path = formReviveItem.getAttribute("data-path");
    buttonRevive.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("ban co chac muon phuc hoi san pham nay ?");
            if(isConfirm) {
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=PATCH`;
                formReviveItem.action = action;
                formReviveItem.submit();
            }
        })
    })
}
// end revive item