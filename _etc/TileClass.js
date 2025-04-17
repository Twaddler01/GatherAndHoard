// Data (matches up with dataArray.requirements)
export const gatherCounts = {
    "Pebbles":0,
    "Rocks":0,
    "Twigs":0,
    "Sticks":0,
    "Leaves":0,
};


// Tile settings
export const tile = {
    buttonText: 'Action',
    action: function() {
        console.log('Action triggered...');
    },
    actionErr: function () {
        console.log('Action failed...');
    },

};

// Data array
export const dataArray = [
    {
        id: 'pebblesUpgrade',
        title: 'Pebbles Upgrade',
        desc: 'Much larger than tiny pebbles.',
        available: true,
        canBuy: false,
        requirements: [
            { id: 'Pebbles', count: 5 }
        ]
    },
    {
        id: 'rocksUpgrade',
        title: 'Rocks Upgrade',
        desc: 'Solid and heavy.',
        available: true,
        canBuy: false,
        requirements: [
            { id: 'Rocks', count: 3 },
            { id: 'Pebbles', count: 5 },
            { id: 'Sticks', count: 3 },
        ]
    },
    {
        id: 'twigsUpgrade',
        title: 'Twigs Upgrade',
        desc: 'More pokey.',
        available: true,
        canBuy: false,
        requirements: [
            { id: 'Twigs', count: 5 }
        ]
    },
    // duplicates
    {
        id: 'twigsUpgrade',
        title: 'Twigs Upgrade',
        desc: 'More pokey.',
        available: true,
        canBuy: false,
        requirements: [
            { id: 'Twigs', count: 5 }
        ]
    },
    {
        id: 'twigsUpgrade',
        title: 'Twigs Upgrade',
        desc: 'More pokey.',
        available: true,
        canBuy: false,
        requirements: [
            { id: 'Twigs', count: 5 }
        ]
    },
    {
        id: 'twigsUpgrade',
        title: 'Twigs Upgrade',
        desc: 'More pokey.',
        available: true,
        canBuy: false,
        requirements: [
            { id: 'Twigs', count: 5 }
        ]
    },
    {
        id: 'twigsUpgrade',
        title: 'Twigs Upgrade',
        desc: 'More pokey.',
        available: true,
        canBuy: false,
        requirements: [
            { id: 'Twigs', count: 5 }
        ]
    }
];

// const tileBoxes = new TiledBoxes(this, 0, 0, tileData);

export default class TileClass {
    constructor(scene, x, y) {
        this.scene = scene;

        // Stored output manipulation
        this.tileButtons = {}; // Store buttons keyed by data id
        this.tileColor = {};
        this.tileColorCnt = {};

        // Offset of each 'box'
        this.spacingX = 170; // boxWidth +10
        this.spacingY = 170; // boxHeight + 10

        this.container = scene.add.container();

        this.setupBoxes();

    }

    getTileButton(id) {
        return this.tileButtons[id];
    }

    getTileColor(id) {
        return this.tileColor[id];
    }
    
    setupBoxes() {
        this.container.removeAll(true); // clear and destroy existing buttons
    
        const availableWidth = this.scene.scale.width; // or a fixed width container if you're using one
        const boxWidth = 160;
        const addedBoxHeight = 30; // Extra height above square (boxWidth)
        const spacing = 10;
        const totalBoxWidth = boxWidth + spacing;
    
        const maxCols = Math.floor((availableWidth - 20) / totalBoxWidth); // 20 is left margin
        let visibleIndex = 0;
    
        dataArray.forEach((data) => {
            if (!data.available) return;
    
            const bg = this.scene.add.rectangle(-10, -20, boxWidth, boxWidth + addedBoxHeight, 0x000000).setOrigin(0);
    
            const box = this.scene.add.container(0, -10);
            box.add(bg);
    
            const tileText = this.scene.add.text(0, -10, data.title, {
                font: '16px Arial',
                color: '#fff'
            });
    
            let costYOffset = 20;
    
            const tileBtn = this.scene.add.text(0, costYOffset, tile.buttonText, {
                font: '20px Arial',
                backgroundColor: '#333',
                color: '#fff',
                padding: { x: 8, y: 4 },
            }).setInteractive();
    
            tileBtn.on('pointerdown', function () {
                if (data.canBuy) {
                    data.requirements.forEach((req, i) => {
                        if (gatherCounts[req.id] >= req.count) {
                            // Action
                            tile.action();
                        }
                    });
                } else {
                    tile.actionErr();
                }
            }, this);
    
            this.tileButtons[data.title] = tileBtn;
    
            const requiresText = this.scene.add.text(0, costYOffset + 30, '* Requires:', {
                font: '16px Arial',
                color: 'red'
            });
            
            this.tileColor[data.title + '_lbl'] = requiresText;
    
            let nextCostY = costYOffset + 50;
            const costTexts = [];
    
            data.requirements.forEach((req, i) => {
                const costText = this.scene.add.text(0, nextCostY, `${req.count} ${req.id}`, {
                    font: '16px Arial',
                    color: 'red'
                });
    
                this.tileColor[req.id + '_req_' + i] = costText;
                this.tileColor[req.id + '_cost_' + i] = req.count;
                costTexts.push(costText);
    
                nextCostY += 20;
            });
    
            const descText = this.scene.add.text(0, nextCostY + 10, data.desc, {
                font: '14px Arial',
                color: '#aaa',
                wordWrap: { width: 140 }
            });
    
            box.add([tileText, tileBtn, requiresText, descText, ...costTexts]);
    
            const col = visibleIndex % maxCols;
            const row = Math.floor(visibleIndex / maxCols);
    
            box.x = 20 + col * totalBoxWidth;
            box.y = 20 + row * (boxWidth + addedBoxHeight + spacing);
    
            this.container.add(box);
            visibleIndex++;
        });
    }

    removeBox(box) {
        box.available = false;
        this.setupBoxes();
    }
}

/*
// Craft tab availability
dataArray
.filter(craft => craft.available)
.forEach(craft => {
    const craftBtn = this.scene.craftdBoxes.getTileButton(craft.title);
    const craftReqLabel = this.scene.craftdBoxes.getTileColor(craft.title + '_lbl');

    if (craftBtn) {
        let allMet = true;

        craft.requirements.forEach((req, i) => {
            const reqKey = `${req.id}_req_${i}`;
            const costText = this.scene.craftdBoxes.getTileColor(reqKey);
            const currentCount = gatherCounts[req.id] || 0;

            if (currentCount >= req.count) { // TEST req.count <> 10
                costText.setColor('#2ecc71');
            } else {
                costText.setColor('red');
                allMet = false;
            }
        });

        if (allMet) {
            craftBtn.setBackgroundColor('#2ecc71');
            if (craftReqLabel) craftReqLabel.setColor('#2ecc71');
            // Main trigger
            craft.canBuy = true;
        } else {
            craftBtn.setBackgroundColor('#333');
            if (craftReqLabel) craftReqLabel.setColor('red');
            craft.canBuy = false;
        }
    }
});
*/
