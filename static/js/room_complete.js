const homeBtn = document.getElementById("homeBtn");
const savedRoomsBtn = document.getElementById("savedRoomsBtn");
const saveRoomBtn = document.getElementById("saveRoomBtn");

if (homeBtn) {
    homeBtn.addEventListener("click", function () {
        window.location.href = "/";
    });
}

if (savedRoomsBtn) {
    savedRoomsBtn.addEventListener("click", function () {
        window.location.href = "/saved-rooms";
    });
}

if (saveRoomBtn) {
    saveRoomBtn.addEventListener("click", function () {
        const roomData = localStorage.getItem("currentRoomDesign");

        fetch("/save-room-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                room_name: ROOM_NAME,
                room_data: roomData ? JSON.parse(roomData) : []
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Room saved successfully!");
                window.location.href = "/saved-rooms";
            } else {
                alert(data.message);
            }
        });
    });
}