//chuc nang gui yeu cau
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add");
            const userId = button.getAttribute("btn-add-friend");
            socket.emit("CLIENT_ADD_FRIEND", userId);
        })
    })
}
//end chuc nang gui yeu cau
//chuc nang huy yeu cau
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add");
            const userId = button.getAttribute("btn-cancel-friend");
            socket.emit("CLIENT_CANCEL_FRIEND", userId);
        })
    })
}
//end chuc nang huy yeu cau
//xoa yeu cau
const refuseFriend = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("refuse");
        const userId = button.getAttribute("btn-refuse-friend");
        socket.emit("CLIENT_REFUSE_FRIEND", userId);
    })
}
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        refuseFriend(button);
    })
}
//end xoa yeu cau
//chap nhan yeu cau
const acceptFriend = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("accepted");
        const userId = button.getAttribute("btn-accept-friend");
        socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    })
}
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        acceptFriend(button);
    })
}
//SERVER_RETURN_LENGHT_ACCEPT
const badgeUsersAccept = document.querySelector("[badge-users-accept]");
if (badgeUsersAccept) {
    const userId = badgeUsersAccept.getAttribute("badge-users-accept");
    socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
        if (userId === data.userId) {
            badgeUsersAccept.innerHTML = data.lenghtAcceptFriends;
        }
    });
}
//end chap nhan yeu cau
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    //trang loi moi da nhan
    const dataUsersAccept = document.querySelector("[data-users-accept]");
    if (dataUsersAccept) {
        const userId = dataUsersAccept.getAttribute("data-users-accept");
        if (userId === data.userId) {
            const div = document.createElement("div");
            div.classList.add("col-6");
            div.setAttribute("user-id", data.infoUserA._id);
            div.innerHTML = `
                <div class="box-user">
                    <div class="inner-avatar">
                        <img src="https://robohash.org/hicveldicta.png" alt="${data.infoUserA.fullName}">
                    </div>
                    <div class="inner-info">
                        <div class="inner-name">
                            ${data.infoUserA.fullName}
                        </div>
                        <div class="inner-buttons">
                            <button 
                                class="btn btn-sm btn-primary mr-1" 
                                btn-accept-friend="${data.infoUserA._id}"
                            >
                                Chấp nhận
                            </button>
                            <button 
                                class="btn btn-sm btn-secondary mr-1" 
                                btn-refuse-friend="${data.infoUserA._id}"
                            >
                                Xóa
                            </button>
                            <button 
                                class="btn btn-sm btn-secondary mr-1" 
                                btn-deleted-friend="" 
                                disabled=""
                            >
                                Đã xóa
                            </button>
                            <button 
                                class="btn btn-sm btn-primary mr-1" 
                                btn-accepted-friend="" 
                                disabled=""
                            >
                                Đã chấp nhận
                            </button>
                        </div>
                    </div>
                </div>
            `

            dataUsersAccept.appendChild(div);
            //huy loi moi ket ban
            const buttonRefuse = div.querySelector("[btn-refuse-friend]");
            refuseFriend(buttonRefuse);
            //end huy loi moi ket ban
            //chap nhan
            const buttonAccept = div.querySelector("[btn-accept-friend]");
            acceptFriend(buttonAccept);
            //chap nhan
        }
    }

    //trang danh sach nguoi dung
    const dataUsersNotFriend = document.querySelector("[data-users-not-friend]");
    if (dataUsersNotFriend) {
        const userId = dataUsersNotFriend.getAttribute("data-users-not-friend");
        if (userId === data.userId) {
            const boxUserRemove = document.querySelector(`[user-id='${data.infoUserA._id}']`);
            if (boxUserRemove) {
                dataUsersNotFriend.removeChild(boxUserRemove);
            }
        }
    }

})


// SERVER_RETURN_USER_ID_ACCEPT_FRIEND


socket.on("SERVER_RETURN_USER_ID_ACCEPT_FRIEND", (data) => {
    const userIdA = data.userIdA;
    const boxUserRemove = document.querySelector(`[user-id='${userIdA}']`);
    if (boxUserRemove) {
        const dataUsersAccept = document.querySelector("[data-users-accept]");
        const userIdB = badgeUsersAccept.getAttribute("badge-users-accept");
        if (userIdB === data.userIdB) {
            dataUsersAccept.removeChild(boxUserRemove);
        }
    }
});
// SERVER_RETURN_USER_ID_ACCEPT_FRIEND