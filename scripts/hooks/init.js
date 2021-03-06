/**
 * Init function loads tables, registers settings, and loads templates
 */
Hooks.once("init", () => {
    // load tables from system folder
    FilePicker.browse("data", "systems/dh2e/tables").then(resp => {
      try
      {
      if (resp.error)
        throw ""
      for (var file of resp.files)
      {
        try {
          if (!file.includes(".json"))
            continue
          let filename = file.substring(file.lastIndexOf("/")+1, file.indexOf(".json"));
          fetch(file).then(r=>r.json()).then(async records => {
            WFRP_Tables[filename] = records;
          })
        }
        catch(error) {
         console.error("Error reading " + file + ": " + error)
        }
      }
    }
    catch
    {
      // Do nothing
    }
    })
    // Create scatter table
    WFRP_Tables.scatter = {
      name : "Scatter",
      die : "1d10",
      rows : [
        {
          name : "Top Left",
          range: [1, 1]
        },
        {
          name : "Top Middle",
          range: [2, 2]
        },
        {
          name : "Top Right",
          range: [3, 3]
        },
        {
          name : "Center Left",
          range: [4, 4]
        },
        {
          name : "Center Right",
          range: [5, 5]
        },
        {
          name : "Bottom Left",
          range: [6, 6]
        },
        {
          name : "Bottom Middle",
          range: [7, 7]
        },
        {
          name : "Bottom Right",
          range: [8, 8]
        },
        {
          name : "At your feet",
          range: [9, 9]
        },
        {
          name : "At the target's feet",
          range: [10, 10]
        },
      ]
    }

    // Create Winds table
    WFRP_Tables.winds = {
      name : "The Swirling Winds",
      die : "1d10",
      rows : [
        {
          modifier : "-30",
          range: [1, 1]
        },
        {
          modifier : "-10",
          range: [2, 3]
        },
        {
          modifier : "0",
          range: [4, 7]
        },
        {
          modifier : "+10",
          range: [8, 9]
        },
        {
          modifier : "+30",
          range: [10, 10]
        }
      ]
    }


    game.settings.register("dh2e", "systemMigrationVersion", {
      name: "System Migration Version",
      scope: "world",
      config: false,
      type: Number,
      default: 0
    });

    // Register initiative rule
    game.settings.register("dh2e", "initiativeRule", {
      name: "SETTINGS.InitRule",
      hint: "SETTINGS.InitHint",
      scope: "world",
      config: true,
      default: "default",
      type: String,
      choices: {
        "default": "SETTINGS.InitDefault",
        "sl": "SETTINGS.InitSL",
        "d10Init": "SETTINGS.InitD10",
        "d10InitAgi": "SETTINGS.InitD10Agi"
      },
      onChange: rule => _setWfrp4eInitiative(rule)
    });
    _setWfrp4eInitiative(game.settings.get("dh2e", "initiativeRule"));


    function _setWfrp4eInitiative(initMethod)
    {
      let formula;
      switch (initMethod)
      {
        case "default":
        formula = "@characteristics.i.value + @characteristics.ag.value/100";
        break;

        case "sl":
        formula = "(floor(@characteristics.i.value / 10) - floor(1d100/10))"
        break;

        case "d10Init":
        formula = "1d10 + @characteristics.i.value"
        break;

        case "d10InitAgi":
        formula = "1d10 + @characteristics.i.bonus + @characteristics.ag.bonus"
        break;
      }

      let decimals = (initMethod == "default") ? 2 : 0;
      CONFIG.Combat.initiative = {
        formula: formula,
        decimals: decimals
      }
    }


     // Register Advantage cap
     game.settings.register("dh2e", "capAdvantageIB", {
       name: "SETTINGS.CapAdvIB",
       hint: "SETTINGS.CapAdvIBHint",
       scope: "world",
       config: true,
       default: false,
       type: Boolean
     });

    // Register Fast SL rule
    game.settings.register("dh2e", "fastSL", {
      name: "SETTINGS.FastSL",
      hint: "SETTINGS.FastSLHint",
      scope: "world",
      config: true,
      default: false,
      type: Boolean
    });

    // Register Tests above 100% Rule
    game.settings.register("dh2e", "testAbove100", {
      name: "SETTINGS.TestsAbove100",
      hint: "SETTINGS.TestsAbove100Hint",
      scope: "world",
      config: true,
      default: false,
      type: Boolean
    });

    // Register Criticals/Fumbles on all tests
    game.settings.register("dh2e", "criticalsFumblesOnAllTests", {
      name: "SETTINGS.CriticalsFumblesAllTests",
      hint: "SETTINGS.CriticalsFumblesAllTestsHint",
      scope: "world",
      config: true,
      default: false,
      type: Boolean
    });


      // Register Extended Tests
      game.settings.register("dh2e", "extendedTests", {
        name: "SETTINGS.ExtendedTests",
        hint: "SETTINGS.ExtendedTestsHint",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
      });

      // Register Test auto-fill
      game.settings.register("dh2e", "testAutoFill", {
        name: "SETTINGS.TestDialogAutoPopulate",
        hint: "SETTINGS.TestDialogAutoPopulateHint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
      });


      // Register Test auto-fill
      game.settings.register("dh2e", "autoFillAdvantage", {
        name: "SETTINGS.AutoFillAdv",
        hint: "SETTINGS.AutoFillAdvHint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
      });

      // Register default test difficulty
      game.settings.register("dh2e", "testDefaultDifficulty", {
        name: "SETTINGS.TestDialogDefaultDifficulty",
        hint: "SETTINGS.TestDialogDefaultDifficultyHint",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
      });

      // Register NPC Species Randomization
      game.settings.register("dh2e", "npcSpeciesCharacteristics", {
        name: "SETTINGS.NpcAverageChar",
        hint: "SETTINGS.NpcAverageCharHint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
      });

      // Register Partial Channelling
      game.settings.register("dh2e", "partialChannelling", {
        name: "SETTINGS.PartialChannelling",
        hint: "SETTINGS.PartialChannellingHint",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
      });

      // Register Round Summary
      game.settings.register("dh2e", "displayRoundSummary", {
        name: "SETTINGS.RoundSummary",
        hint: "SETTINGS.RoundSummaryHint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
      });

      // Register Status on Turn Start
      game.settings.register("dh2e", "statusOnTurnStart", {
        name: "SETTINGS.StatusTurnStart",
        hint: "SETTINGS.StatusTurnStartHint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
      });


      // Register Focus on Turn Start
      game.settings.register("dh2e", "focusOnTurnStart", {
        name: "SETTINGS.FocusTurnStart",
        hint: "SETTINGS.FocusTurnStartHint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
      });

      // Register Hiding Test Data
      game.settings.register("dh2e", "hideTestData", {
        name: "SETTINGS.HideTestData",
        hint: "SETTINGS.HideTestDataHint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
      });

      // Register Manual Chat Cards
      game.settings.register("dh2e", "manualChatCards", {
        name: "SETTINGS.ManualChatCards",
        hint: "SETTINGS.ManualChatCardsHint",
        scope: "client",
        config: true,
        default: false,
        type: Boolean
      });

      game.settings.register("dh2e", "playerBrowser", {
        name: "SETTINGS.PlayerBrowser",
        hint: "SETTINGS.PlayerBrowserHint",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
      });

      // Register Advantage cap
      game.settings.register("dh2e", "soundEffects", {
        name: "SETTINGS.SoundEffects",
        hint: "SETTINGS.SoundEffectsHint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
      });

      game.settings.register("dh2e", "customCursor", {
        name: "SETTINGS.CustomCursor",
        hint: "SETTINGS.CustomCursorHint",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
      });

      game.settings.register("dh2e", "dangerousCrits", {
        name: "SETTINGS.DangerousCrits",
        hint: "SETTINGS.DangerousCritsHint",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
      });

      game.settings.register("dh2e", "dangerousCritsMod", {
        name: "SETTINGS.DangerousCritsMod",
        hint: "SETTINGS.DangerousCritsModHint",
        scope: "world",
        config: true,
        default: 10,
        type: Number
      });

    // Pre-load templates
    loadTemplates([
      "systems/dh2e/templates/actors/actor-attributes.html",
      "systems/dh2e/templates/actors/actor-abilities.html",
      "systems/dh2e/templates/actors/actor-main.html",
      "systems/dh2e/templates/actors/actor-combat.html",
      "systems/dh2e/templates/actors/actor-biography.html",
      "systems/dh2e/templates/actors/actor-inventory.html",
      "systems/dh2e/templates/actors/actor-skills.html",
      "systems/dh2e/templates/actors/actor-magic.html",
      "systems/dh2e/templates/actors/actor-religion.html",
      "systems/dh2e/templates/actors/actor-talents.html",
      "systems/dh2e/templates/actors/actor-classes.html",
      "systems/dh2e/templates/actors/actor-notes.html",
      "systems/dh2e/templates/actors/npc-main.html",
      "systems/dh2e/templates/actors/npc-notes.html",
      "systems/dh2e/templates/actors/creature-main.html",
      "systems/dh2e/templates/actors/creature-notes.html",
      "systems/dh2e/templates/actors/creature-main.html",
      "systems/dh2e/templates/chat/dialog-constant.html",
      "systems/dh2e/templates/chat/test-card.html",
      "systems/dh2e/templates/chat/chat-command-display-info.html",
      "systems/dh2e/templates/items/item-header.html",
      "systems/dh2e/templates/items/item-description.html",
    ]);

    // Load name construction from files
    NameGenWfrp._loadNames();
    CONFIG.Morrslieb = new PIXI.filters.AdjustmentFilter({green: 0.7137, red: 0.302, blue: 0.2275})

  });
