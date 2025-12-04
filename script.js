/*
   Part 2: Working with the DOM (Elements panel)

   A. Viewing elements

      1. Inspecting
         Right-click any part of the page (like the pet image or a stat) and choose “Inspect”.
         DevTools will highlight the corresponding DOM element.

      2. Navigating with the keyboard
         - Up/Down to move between elements
         - Left to collapse or move to a parent
         - Right to expand children

      3. Scrolling into view
         Right-click an element in the DOM tree and select “Scroll into view”.

      4. Showing rulers on hover
         Enable rulers to help visualize spacing and layout.

      5. Searching the DOM
         Press Ctrl+F and search for selectors like:
           .pet-card
           .hunger-fill


   B. Editing the DOM

      1. Editing text
         Double-click text inside the DOM tree to change it.

      2. Editing attributes
         You can modify things like <img src> or add attributes such as title="Nailong".

      3. Changing element type
         Double-click a tag name to change the element, for example <span> to <strong>.

      4. Editing as HTML
         Right-click any element and choose “Edit as HTML”.

      5. Duplicating elements
         Useful for quickly testing layout changes.

      6. Capturing a node screenshot

      7. Reordering elements by dragging them in the tree

      8. Forcing states like :hover or :active

      9. Hiding elements by pressing H

      10. Deleting and undoing elements (Delete, then Ctrl+Z)


   C. Accessing DOM elements in the console

      1. Using $0
         The last selected element in Elements appears as $0 in the console.

      2. Storing as a global variable
         You can store an inspected element as temp1, temp2, etc.

      3. Copying the JS path
         Right-click → Copy → Copy JS path


   D. Breaking on DOM changes

      You can set DevTools to pause whenever a specific element changes.
      For example, right-click the hunger bar element and choose Break on → attribute modifications.
      When the bar width changes, Chrome pauses and shows what caused it.


   E. HTML vs DOM

      index.html on disk never changes while the page runs.
      script.js updates the live DOM only (for example changing text or bar widths).
*/


$(function () {
  checkAndUpdatePetInfoInHtml();
  $(".treat-button").on("click", clickedTreatButton);
  $(".play-button").on("click", clickedPlayButton);
  $(".exercise-button").on("click", clickedExerciseButton);
  $(".nap-button").on("click", clickedNapButton);

  $(".treat-button").trigger("click");
});

var pet_info = {
  name: "Nailong",
  weight: 10,
  happiness: 5,
  hunger: 50,
  energy: 70,
  level: 1,
  exp: 0
};

function clickedTreatButton() {
  pet_info.happiness += 1;
  pet_info.weight += 1;
  pet_info.hunger += 10;
  pet_info.energy -= 2;

  animatePet();
  gainEXP(5);

  showMessage("Yum! That was tasty!");
  checkAndUpdatePetInfoInHtml();
}

function clickedPlayButton() {
  pet_info.happiness += 3;
  pet_info.weight -= 1;
  pet_info.hunger -= 5;
  pet_info.energy -= 10;

  animatePet();
  gainEXP(8);

  showMessage("That was fun!");
  checkAndUpdatePetInfoInHtml();
}

function clickedExerciseButton() {
  pet_info.happiness -= 1;
  pet_info.weight -= 2;
  /* ---------------------------------------------------------
     Example Bug

     Instead of decreasing hunger during exercise:

         pet_info.hunger += 10;

     This makes the hunger bar INCREASE every time
     the Exercise button is pressed.

     To debug:
       - Set a breakpoint on the hunger update line
       - Click “Exercise”
       - Observe hunger going UP instead of DOWN
     --------------------------------------------------------- */
  pet_info.hunger -= 10;
  pet_info.energy -= 15;

  animatePet();
  gainEXP(10);

  showMessage("I'm getting stronger!");
  checkAndUpdatePetInfoInHtml();
}

function clickedNapButton() {
  pet_info.energy += 20;
  pet_info.hunger -= 3;

  animatePet();
  gainEXP(2);

  showMessage("Zzz... comfy nap!");
  checkAndUpdatePetInfoInHtml();
}

function gainEXP(amount) {
  pet_info.exp += amount;
  if (pet_info.exp >= 50) {
    pet_info.exp = 0;
    pet_info.level++;
    showMessage("LEVEL UP! New level: " + pet_info.level);
  }
}

function checkAndUpdatePetInfoInHtml() {
  clampStats();
  checkDangerStates();
  updatePetInfoInHtml();
}

function clampStats() {
  pet_info.weight = Math.max(0, pet_info.weight);
  pet_info.happiness = Math.max(0, pet_info.happiness);
  pet_info.hunger = Math.min(100, Math.max(0, pet_info.hunger));
  pet_info.energy = Math.min(100, Math.max(0, pet_info.energy));
}

function updatePetInfoInHtml() {
  $(".name").text(pet_info.name);
  $(".weight").text(pet_info.weight);
  $(".happiness").text(pet_info.happiness);
  $(".level").text(pet_info.level);

  $(".hunger-fill").css("width", pet_info.hunger + "%");
  $(".energy-fill").css("width", pet_info.energy + "%");
}

function showMessage(text) {
  const msg = $(".pet-message");
  msg.stop(true, true);
  msg.text(text);
  msg.fadeIn(200).delay(1200).fadeOut(300);
}

function animatePet() {
  const pet = $(".pet-image");
  pet.addClass("animated");
  setTimeout(() => pet.removeClass("animated"), 350);
}

function checkDangerStates() {
  if (pet_info.energy === 0) {
    if (pet_info.level > 1) {
      pet_info.level--;
      showMessage("Your pet is exhausted! Level decreased.");
    } else {
      showMessage("Your pet is too tired to continue!");
    }
  }

  if (pet_info.hunger === 0) {
    pet_info.level = 0;
    showMessage("Your pet has starved... Level reset to 0.");
  }
}
