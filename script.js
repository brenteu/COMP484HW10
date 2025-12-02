/* ============================================================================
   CHROME DEVTOOLS DEBUGGING GUIDE (JavaScript + DOM)
   --------------------------------------------------------------------------
   PART 1 — DEBUGGING JAVASCRIPT (Sources Panel)
   --------------------------------------------------------------------------

   1) Reproduce the bug
      - Open index.html in Chrome.
      - Open DevTools (F12 or Ctrl+Shift+I / Cmd+Opt+I).
      - Click Treat / Play / Exercise / Nap repeatedly.
      - Observe incorrect stat changes or UI behavior.

   2) Get familiar with the Sources panel UI
      - Open DevTools → Sources tab.
      - Left side = Page file tree → click script.js.
      - Middle = code editor.
      - Right = Debugger (Breakpoints, Scope, Call Stack, Watch, etc.).

   3) Pause the code
      Option A: Event Listener Breakpoint
        - In the Debugger panel → Event Listener Breakpoints → Mouse → check "click".
        - Now ANY click instantly pauses inside the click handler.
      Option B: Line-of-code breakpoint (see #5).

   4) Step through code
      - When paused, use:
          Step Into   → follow inside called functions
          Step Over   → run line without entering functions
          Step Out    → finish function and return
      - Lets you watch how pet_info changes step-by-step.

   5) Set a line-of-code breakpoint
      - In script.js, click the LEFT gutter next to:
            $(".hunger-fill").css("width", pet_info.hunger + "%");
      - Chrome pauses before applying bar width.
      - Check hunger/energy BEFORE DOM updates.

   6) Check variable values — 3 methods
      Method 1: Scope
        - Shows local + global vars while paused.
        - Expand pet_info to inspect live values.
      
      Method 2: Watch Expressions
        - Add:
             pet_info.hunger
             pet_info.energy
             pet_info.level
        - Updates automatically as you step through code.

      Method 3: Console (while paused)
        - Press Esc to open console drawer.
        - Type:
             pet_info
             pet_info.hunger
             pet_info.energy
        - You can run test calculations here safely.

   7) Apply a fix
      - While paused, edit the code in Sources panel directly.
      - Press Ctrl+S / Cmd+S to apply the temp patch.
      - Resume execution → test → then apply the same fix in your real file.

   --------------------------------------------------------------------------
   PART 2 — DOM INTERACTION (Elements Panel)
   --------------------------------------------------------------------------

   A) View DOM nodes
      1) Inspect a node
         - Right-click the pet image or text → Inspect.
         - Elements panel highlights actual DOM element.

      2) Keyboard navigation
         - Up/Down → move siblings
         - Left → collapse / go to parent
         - Right → expand children

      3) Scroll into view
         - Right-click → "Scroll into view" to jump the page to that element.

      4) Show rulers on hover
         - Command menu → "Show rulers on hover".
         - Helps visualize spacing on .dashboard, .pet-card, etc.

      5) Search DOM
         - Ctrl+F / Cmd+F inside Elements.
         - Try:
             .pet-card
             .hunger-fill
             "GigaPet"

   B) Edit the DOM
      1) Edit text
         - Double-click <h1>GigaPet</h1> and rename it.

      2) Edit attributes
         - Example: change <img src>, add title="Nailong".

      3) Edit node type
         - Double-click tag name to change <span> → <strong>.

      4) Edit as HTML
         - Right-click element → Edit as HTML.
         - Temporary only—changes the DOM, not your actual file.

      5) Duplicate nodes
         - Right-click a .stat-row → Duplicate element.

      6) Capture node screenshot
         - Right-click an element → Capture node screenshot.

      7) Reorder nodes
         - Drag DOM nodes to rearrange the layout dynamically.

      8) Force element state
         - Right-click → Force state → :hover, :active, etc.

      9) Hide nodes
         - Press H to hide selected element (toggle visibility).

      10) Delete & undo
         - Press Delete to remove an element.
         - Ctrl+Z / Cmd+Z restores it.

   C) Access nodes in the Console
      1) $0
         - Selected element in Elements = $0.
         - Example: select .hunger-fill → console: $0.style.border = "2px solid red";

      2) Store as global
         - Right-click → "Store as global variable" (temp1, temp2, ...).

      3) Copy JS path
         - Right-click element → Copy → Copy JS path.

   D) Break on DOM changes
      - Right-click a DOM node → Break on:
            • Subtree modifications
            • Attribute modifications
            • Node removal
      - Example: break on .hunger-fill to detect when width changes.

   E) HTML vs DOM reminder
      - index.html is static on disk.
      - The DOM is dynamic and changed by script.js.
      - updatePetInfoInHtml() modifies DOM values & bar styles but NOT the HTML file.

   ============================================================================
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
