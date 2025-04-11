import GatherBar from './gatherBar.js';  // Import the GatherBar class

export default class ScrollingBox {
  constructor(scene, x, y, width, height, content, config = {}) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.scrollY = 0;
    this.children = [];

    // For stacking
    this.stackY = 0; // current stack offset

    // Create a container to group everything
    this.container = scene.add.container(x, y); // Adding the container at the x, y position

    // Background
    this.background = scene.add.graphics();
    this.background.fillStyle(config.bgColor || 0x333333, 1);
    this.background.fillRect(0, 0, width, height);
    this.container.add(this.background);

    // Create a mask (geometry mask aligned with the container)
    // Tweaked for use with tabs
    const shape = scene.make.graphics({ x: x, y: y + 45, add: false });
    shape.fillStyle(0xffffff);
    shape.fillRect(0, 0, width, height - 5);
    this.mask = shape.createGeometryMask();

    // Text
    this.textObject = scene.add.text(5, 5, content, {
      fontFamily: config.fontFamily || 'Arial',
      fontSize: config.fontSize || '16px',
      color: config.color || '#ffffff',
      wordWrap: { width: width - 10 }
    }).setOrigin(0, 0).setMask(this.mask);
    this.container.add(this.textObject);

    // Start stacking after text + some padding
    this.currentY = this.textObject.y + this.textObject.height + 10;

    // Invisible filler text (dummy text to fill space)
    const dummyText = "text text text\n".repeat(50); // Adjust repeat count for space
    this.invisibleText = scene.add.text(5, 5, dummyText, {
      fontFamily: config.fontFamily || 'Arial',
      fontSize: config.fontSize || '16px',
      color: config.color || '#ffffff',
      wordWrap: { width: width - 10 }
    }).setOrigin(0, 0).setMask(this.mask).setVisible(false); // Invisible text (hidden but still takes space)
    this.container.add(this.invisibleText);

    this.children.push(this.textObject);
    this.children.push(this.invisibleText); // Add the invisible text as a filler

//// Unsure of 35 value
    this.totalHeight = this.invisibleText.height + 35 + this.y; // Adjust total height including filler

    // Scrollbar Track (relative to container)
    this.scrollBarTrack = scene.add.graphics();
    this.scrollBarTrack.fillStyle(0x555555, 1); // Darker gray for the track
    this.scrollBarTrack.fillRect(width - 10, 0, 10, height); // Positioned relative to the container's x, y
    this.container.add(this.scrollBarTrack);

    // Scrollbar Thumb (relative to container)
    this.scrollBarThumb = scene.add.graphics();
    this.scrollBarThumb.fillStyle(0xffffff, 1); // White for the thumb
    this.thumbHeight = Math.max((height / this.totalHeight) * height, 20); // Ensure thumb is at least 20px tall
    this.scrollBarThumb.fillRect(width - 10, 0, 10, this.thumbHeight - 35 - this.y - 10); // Positioned relative to the container's x, y
    this.container.add(this.scrollBarThumb);

    // Touch scroll
    this.startY = 0;
    this.dragging = false;
    this.textStartY = 0;

    scene.input.on('pointerdown', (pointer) => {
      if (this._inBounds(pointer)) {
        this.startY = pointer.y;
        this.textStartY = this.textObject.y;
        this.dragging = true;
      }
    });

    scene.input.on('pointerup', () => {
      this.dragging = false;
    });

    scene.input.on('pointermove', (pointer) => {
      if (this.dragging) {
        const delta = pointer.y - this.startY;
        this.scrollTo(this.textStartY + delta);
      }
    });
  }

  scroll(amount) {
    this.scrollTo(this.textObject.y - amount);
  }

  scrollTo(newY) {
    const minY = 5 - (this.totalHeight - this.height);  // Ensure no scrolling goes beyond bottom of container
    const maxY = 5; 
    const clampedY = Phaser.Math.Clamp(newY, minY, maxY);  // Clamping ensures we don't scroll out of bounds
    const offset = clampedY - this.textObject.y;

    // Apply scroll offset to all children
    for (const child of this.children) {
      child.y += offset;
    }

    // Update the scroll position (track)
    this.scrollY = maxY - clampedY;

    // Update scrollbar thumb position based on scroll
    const scrollRatio = this.scrollY / (this.totalHeight - this.height);
    const maxThumbY = this.height - this.thumbHeight;
    this.scrollBarThumb.y = scrollRatio * maxThumbY;
  }

  addElement(gameObject, { spacing = 100, startY = 50 } = {}) {
    // Add the element to the container
    this.container.add(gameObject);
    this.children.push(gameObject);
    
    // Set the position for the new element
    gameObject.y = this.stackY + startY;
    
    // Advance stackY for the next element
    this.stackY += spacing;
    
    // Apply the mask to the new element
    gameObject.setMask(this.mask);

    return gameObject;
  }

    removeElement(gameObject, { spacing = 60, startY = 50 } = {}) {
      // Remove from container and children list
      this.container.remove(gameObject, true); // true = destroy from scene
      const index = this.children.indexOf(gameObject);
      if (index !== -1) this.children.splice(index, 1);
    
      // Reset stacking position
      this.stackY = 0;
    
      // Filter for all elements that were added with addElement
      const stackable = this.children.filter(child => child !== this.textObject && child !== this.invisibleText);
    
      // Realign each
      for (const child of stackable) {
        child.y = this.stackY + startY;
        this.stackY += spacing;
      }
    }

    replaceElement(oldContainer, newContainer) {
        // Keep position
        const oldY = oldContainer.y;
    
        // Remove old from container and internal tracking
        this.container.remove(oldContainer, true);
        const index = this.children.indexOf(oldContainer);
        if (index !== -1) this.children.splice(index, 1);
    
        // Add new one in same place
        newContainer.y = oldY;
        this.container.add(newContainer);
        this.children.push(newContainer);
        newContainer.setMask(this.mask);
    
        return newContainer;
    }

  setText(content) {
    this.textObject.setText(content);
    this.totalHeight = this.textObject.height + this.invisibleText.height;
    this.scrollTo(this.y + 5);
  }

  _inBounds(pointer) {
    return (
      pointer.x >= this.x &&
      pointer.x <= this.x + this.width &&
      pointer.y >= this.y &&
      pointer.y <= this.y + this.height
    );
  }
}

// USAGE
/*
const scrollBox = new ScrollingBox(this, 50, 100, 250, 200, "Initial text test123", {
  bgColor: 0x0000ff,  // Blue background for testing
  fontFamily: 'Arial',
  fontSize: '18px',
  color: '#ffffff'
});
*/