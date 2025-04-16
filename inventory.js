import { gatherCounts } from './MainScene.js';

// const inventory = new Inventory(this, 0, 0);

export default class Inventory {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.textObjects = {}; // store references to update later
        this.container = scene.add.container(x, y);

        this.setupInventory();
    }

    setupInventory() {
        const titleText = this.scene.add.text(10, 0, 'INVENTORY', {
            font: '18px Arial',
            color: '#ffffff'
        });
        this.container.add(titleText);

        let offsetY = 30;
        let offsetX = 10;
        for (const id in gatherCounts) {
            const value = gatherCounts[id];
            const lineText = this.scene.add.text(offsetX, offsetY, `${id}: ${value}`, {
                font: '16px Arial',
                color: '#ccc'
            });
            this.container.add(lineText);
            this.textObjects[id] = lineText;
            offsetY += 24;
        }
    }

    updateInventory() {
        for (const id in gatherCounts) {
            if (id.endsWith('_auto')) continue;
            const value = gatherCounts[id];
    
            if (this.textObjects[id]) {
                this.textObjects[id].setText(`${id}: ${value}`);
            } else {
                // Determine y-position based on last item in container
                let offsetY = 20; // default padding if it's the first
                if (this.container.length > 0) {
                    const last = this.container.getAt(this.container.length - 1);
                    offsetY = last.y + last.height + 6; // add spacing below last
                }
    
                const newText = this.scene.add.text(10, offsetY, `${id}: ${value}`, {
                    font: '16px Arial',
                    color: '#ccc'
                });
    
                this.container.add(newText);
                this.textObjects[id] = newText;
                
                this.scene.scrollBox.reflowElements(); // adjusts all elements below inventory
                //const invBounds = this.container.getBounds();
                //this.scene.scrollBox.reflowElements(invBounds.bottom + 10);

            }
        }
    }
}