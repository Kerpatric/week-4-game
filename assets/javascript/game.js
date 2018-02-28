//Execute this code when the DOM has fully loaded.
$(document).ready(function () {

    // VARIABLE DECLARATION
    //===============================================================================================================================================================================================


    //Object holding our characters.
    var characters = {
        "Natsu Dragneel": {
            name: "Natsu Dragneel",
            health: 180,
            attack: 12,
            imageUrl: "assets/images/Natsu.jpg",
            enemyAttackBack: 12
        },
        "Gajeel Redfox": {
            name: "Gajeel Redfox",
            health: 140,
            attack: 10,
            imageUrl: "assets/images/Gajeel.jpg",
            enemyAttackBack: 12
        },
        "Wendy Marvell": {
            name: "Wendy Marvell",
            health: 100,
            attack: 14,
            imageUrl: "assets/images/Wendy.jpg",
            enemyAttackBack: 6
        },
        "Laxus Dreyar": {
            name: "Laxus Dreyar",
            health: 150,
            attack: 8,
            imageUrl: "assets/images/Laxus.png",
            enemyAttackBack: 16
        }
    };
    //Variable containing current player selected character
    var currSelectedCharacter;
    //array of available enemies to select for combat
    var combatants = [];
    //variable containing current player selected enemy.
    var currDefender;
    //variable containing the turn count
    var turnCounter = 1;
    // Tracks the number of defeated opponents.
    var killCount = 0;

    //FUNCTIONS
    //============================================================================================================================================================================================

    // This function will render a character card to the page.
    // The character rendered and the area they are rendered to.
    var renderOne = function (character, renderArea, CharStatus) {
        var charDiv = $("<div class ='character' data-name='" + character.name + "'>");
        var charName = $("<div class = 'character-name'>").text(character.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
        var charHealth = $("<div class='character-health'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);

        // If the character is an enemy or defender (The active opponent) add the appropriate class
        if (CharStatus === "enemy") {
            $(charDiv).addClass("enemy");
        }
        else if (CharStatus === "defender") {
            //Populate currDefender with selected opponent's information.
            currDefender = character;
            $(charDiv).addClass("target-enemy");
        }
    };

    // Function to handle rendering game messages.
    var renderMessage = function (message) {

        //Builds message and appends it to the page.
        var gameMessageSet = $("#gameMessage");
        var newMessage = $("<div>").text(message);
        gameMessageSet.append(newMessage);

        // If we get this specific message passed in, clear the message area.
        if (message === "clearMessage") {
            gameMessageSet.text("");
        }
    };

    //This function handles rendering the characters
    var renderCharacters = function (charObj, areaRender) {

        //"characterSectrion" is the dive where all of our characters begin the games
        // If true, render all characters tot eh starting area.
        if (areaRender === "#characterSection") {
            $(areaRender).empty();
            // Loop through the characters object and the call the renderOne function
            for (var key in charObj) {
                if (charObj.hasOwnProperty(key)) {
                    renderOne(charObj[key], areaRender, "");
                }
            }
        }


        // "selectedCharacter" is the div where our chosen character appears.
        // If true, render the selected character to this area
        if (areaRender === "#selectedCharacter") {
            renderOne(charObj, areaRender, "");
        }

        // "ableToAttack is the div where our "inactive" opponents wait their turn
        // If true, render the selected character to this area.
        if (areaRender === "#ableToAttack") {

            //Loop through the combatants array and call the renderOne function to each character.
            for (var i = 0; i < charObj.length; i++) {
                renderOne(charObj[i], areaRender, "enemy");
            }

            //Creates on click event for each enemy.
            $(document).on("click", ".enemy", function () {
                var Name = ($(this).attr("data-name"));

                //if there is no defender, the clicked enemy will become the defender.
                if ($("#defender").children().length === 0) {
                    renderCharacters(Name, "#defender");
                    $(this).hide();
                    renderMessage("clearMessage");
                }
            });
        }

        // "defender" is the div where the active opponenet appears.
        // If true, render selected enemy in this location.
        if (areaRender === "#defender") {
            $(areaRender).empty();
            for (var i = 0; i < combatants.length; i++) {
                if (combatants[i].name === charObj) {
                    renderOne(combatants[i], areaRender, "defender");
                }
            }
        }
        //Re-render defender when attacked.
        if (areaRender === "playerDamage") {
            $("#defender").empty();
            renderOne(charObj, "#defender", "defender")
        }

        //Re- render player character when attacked.
        if (areaRender === "enemyDamage") {
            $("#selectedCharacter").empty();
            renderOne(charObj, "#selectedCharacter", "");
        }

        // Remove defeated enemy.
        if (areaRender === "enemyDefeated") {
            $("defender").empty();
            var gameStateMessage = "You have defeated " + charObj.name + ", you can choose to fight another enemy now.";
            renderMessage(gameStateMessage);
        }
    };

    // Function that resets the game after vidtory defeat.
    var restartGame = function (inputEndGame) {

        // When the restart button is clicked reload the page.
        var restart = $("<button>Restart</button>").click(function () {
            location.reload();
        });

        //build div that will display the victory/defeat message.
        var gameState = $("<div>").text(inputEndGame);

        //render the restart button and victor/defeat message to the page.
        $("body").append(gameState);
        $("body").append(restart);
    };

    // Reder all characters to the page when the game starts.
    renderCharacters(characters, "#characterSection");

    // click event for selecting player character.
    $(document).on("click", ".character", function () {
        // Saving the clicked characters name.
        var Name = $(this).attr("data-name");

        // If a character has not yet been chosen...
        if (!currSelectedCharacter) {
            // we populate the currSelectedCharacter with the selected character's information.
            currSelectedCharacter = characters[Name];
            // we then loop through the remaining characters and push them to the enemies available div..
            for (var key in characters) {
                if (key !== Name) {
                    combatants.push(characters[key]);
                }
            }
            console.log(combatants);
            // Hide the character select div.
            $("#characterSection").hide();


            // Then render our selected character and our combatants.
            renderCharacters(currSelectedCharacter, "#selectedCharacter");
            renderCharacters(combatants, "#ableToAttack");
        }
    });

    //When you click the attack button, the following game logic will run
    $("#attackButton").on("click", function () {

        if ($("#defender").children().length !== 0) {

            // Creates messages for our attack and our opponents counter attack.
            var attackMessage = "You attacked " + currDefender.name + " for " + (currSelectedCharacter.attack * turnCounter) + " damage.";
            var counterAttackMessage = currDefender.name + " Hit you back for " + currDefender.enemyAttackBack + " damage.";
            renderMessage("clearMessage");

            //reduce defeneders hp by the total of the attackers attack power
            currDefender.health -= (currSelectedCharacter.attack * turnCounter);

            //if the enemy still has health remaining..
            if (currDefender.health > 0) {

                //Render the enemy's updated character card.
                renderCharacters(currDefender, "playerDamage");

                // Render combat messages.
                renderMessage(attackMessage);
                renderMessage(counterAttackMessage);

                //Reduce player health by the opponent's counter attack damage..
                currSelectedCharacter.health -= currDefender.enemyAttackBack;

                // Render the player's updatedc character card.
                renderCharacters(currSelectedCharacter, "enemyDamage");

                // if you have less than zero health the games ends.
                // we call the restartGame function to allow the user to try again.
                if (currSelectedCharacter <= 0) {
                    renderMessage("clearMessage");
                    restartGame("You have been defeated... Game Over!!!");
                    $("#attackButton").unbind("click");
                }
            }

            // If the enemy has less than zero health they are defeated.
            else {
                //Remove your opponents character card
                renderCharacters(currDefender, "enemyDefeated");
                // increase kill count.
                killCount++;
                // if you kill all opponents you win.
                if (killCount >= 3) {
                    renderMessage("clearMessage");
                    restartGame("You WON!!!!");
                }
            }
            turnCounter++;
        }
    });
});