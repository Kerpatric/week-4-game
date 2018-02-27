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
    var currSelectedCharacter;
    var combatants = [];
    var currDefender;

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
    }

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
            $(document).on("click", ".enemy", function() {
                var Name = ($(this).attr("data-name"));

                //if there is no defender, the clicked enemy will become the defender.
                if ($("#defender").children().length === 0) {
                    renderCharacters(Name, "#defender");
                    $(this).hide;
                }
            });
        }

        // "defender" is the div where the active opponenet appears.
        // If true, render selected enemy in this location.
        if (areaRender === "#defender") {
            $(areaRender).empty();
            for (var i = 0; i < combatants.length; i++) {
                if(combatants[i].name === charObj) {
                    renderOne(combatants[i], areaRender, "defender");
                }
            }
        }
    }

    // Reder all characters to the page when the game starts.
    renderCharacters(characters, "#characterSection");

    // click event for selecting player character.
    $(document).on("click", ".character", function() {
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
    })
});