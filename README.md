# Wakfu.how

Get Started
    - classes
    - Quests
Guides
    - dungeons

Theory Crafting
    - Sublimaitons
    - Equipments

Latest Posts

---
To do:

use less categories, but use sub categories when needed. Add filter with colors, filter by category instead of levels

-- 
Sublis prompt: 


so i want to make the following change to the sublimations file:

- I will personally change the json so it fits, tell me what i will have to fill in each field for the json. feel free to rename the fields as fits so i can fill them.
- The end result would be multiple cards, each care for each sublimations. The care will have the following:
   - Name followed by the level, like influence Lvl. 5
    -Description
    - Drop rarity (Rare, mythical, legendary),  i want to replace the rarities by icons:  rare: https://static.ankama.com/wakfu/portal/game/item/115/81228822.png
mythical: https://static.ankama.com/wakfu/portal/game/item/115/81228823.png
legendary: https://static.ankama.com/wakfu/portal/game/item/115/81227111.png
     -Obtenation: will be an icon of the monster like: https://static.ankama.com/wakfu/portal/game/monster/200/190004327.w133h.png following by his name Sorhon
  - Category: values like AP gain, MP gain, Damage %... And i want this to be the main filter, it doesnt need to show up in the card itself.
 - Color: It can either be a group of 3 colors RGB (like RRG, GBG..) or Relic, or Epic. If the value has R, G,or B, use the following icon for each color: R: https://methodwakfu.com/wp-content/uploads/2020/04/chasse_rouge_xs.png G: https://methodwakfu.com/wp-content/uploads/2020/04/chasse_verte_xs.png B: https://methodwakfu.com/wp-content/uploads/2020/04/chasse_bleue_xs.png , and if Relic or Epic, you just right Epic in pink, and Relic in purple
   

Now the Description: it will generally be a text having one variable changes based on the selected level. In some cases it will be 2 values that vary. the data in backend will also contain the lowest level of the value which is also the increase steps, and a maximum level of the sublimation. 

At the bottom, i want to add a slider, that goes from the lowest to the maximum level, increasing by the steps (which is the lowest value)

Here are the possible values these fields can have for description. The minimum value/step can only be 1 or 2, the maximum can be 2, 4 or 6. For the description itself here are a few examples:

-Influence:  X% Critical Hit. // Starts at level 1 with the value X=3, it can reach level 6 maximum. It is GBG, drops in Runic Mimic, Category of Crit % . drops in rare, mythical and legendary.
- Raw power: At start of Fight - X max WP. For each WP spent during turn: Y% damage inflicted. // starts at lvl 1 with X=1 and Y=2. 

on desktop, i want the main page to show 3 cards. each card rectangular, at the top just shows the name and below it Lvl. X in smaller font than name , both at the left side. on the right side i want to see the Color on the right side. then a separation line. then obtenation on the left, and the rarity on the right, then a separation line, then Description following the rules above taking the full width, then a separation, then the slider taking most of the space. on the right of the slider, add possibility of a little square where the user can see the level selected on the slider.