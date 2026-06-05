const cards = document.querySelectorAll(".card");

for(let i = 0; i < cards.length; i++){

    cards[i].addEventListener("click", function(){

        alert(
            "You selected " +
            cards[i].querySelector("h3").textContent +
            " style"
        );

    });

}