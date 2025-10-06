import { forwardRef, useImperativeHandle, useState } from "react";

import '../styles/ColorSelector.css';

/**
 * A custom made color selection menu that has more style than the default browser one.
 * Designed for a preview of each color to slide in from the left when each option is hovered over.
 * 
 * Params
 *  setParentTheme-Function: Passed from parent to change the color scheme of a WIP event or WIP event list.
 */
const ColorSelector = forwardRef(({setParentTitleColor}, ref) => {
    
    const [open, setOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState('Default');


    /**
     * This goes off when an edit button is clicked in the parent, pulling an old event up.
     * This function sets the colorSelector to reflect this "new" event.
     */
    useImperativeHandle(ref, () => ({
        colorMatch(passedCode) {
            let passedColor = findColorKey(passedCode);
            setParentTitleColor(window.$themes[passedColor]);
            setSelectedColor(passedColor);
        }
    }))

    /**
     * Helper function to loop through the themes constant and find a key based on
     * one hex code value
     * 
     * colorCode-String: a hex color code
     */
    const findColorKey = (colorCode) => {
        
        for (let obj in window.$themes)
        {
            if (window.$themes[obj].includes(colorCode))
            {
                return(obj);
            }
        }
    }

    /**
     * Tracks whether open or not
     */
    const handleOpenClick = () => {
        setOpen(!open);
    }

    /**
     * Handles color selecion and updates parent components. Collapses menu
     * 
     * Params:
     *  newColor-String: Name/Global Key of the selected color.
     */
    const handleColorClick = (newColor) => {
        setParentTitleColor(window.$themes[newColor]);
        setSelectedColor(newColor);
        setOpen(!open);
    }

    /**
     * UI
     */
    return ( 
        <div className="color-button-container">
            <button type='button' onClick={handleOpenClick} style={open ? {borderBottomRightRadius: '0px', borderBottomLeftRadius: '0px', outlineColor: 'black'} : {borderBottomRightRadius: '5px', borderBottomLeftRadius: '5px'}}>
                <p>{selectedColor}</p>
                <img src={require("./..\\img\\collapseArrow.png")} alt="" />
                
            </button>
            {open && 
                <div className="color-drop-down">  
                    <div className="option-fire" onClick={() => handleColorClick('Fire')}>Fire</div>
                    <div className="option-gold" onClick={() => handleColorClick('Gold')}>Gold</div>
                    <div className="option-rogue" onClick={() => handleColorClick('Rogue')}>Rogue</div>
                    <div className="option-emerald" onClick={() => handleColorClick('Emerald')}>Emerald</div>
                    <div className="option-silver" onClick={() => handleColorClick('Silver')}>Silver</div>
                    <div className="option-ash" onClick={() => handleColorClick('Ash')}>Ash</div>
                    <div className="option-moss" onClick={() => handleColorClick('Moss')}>Moss</div>
                    <div className="option-blood" onClick={() => handleColorClick('Blood')}>Blood</div>
                    <div className="option-rust" onClick={() => handleColorClick('Rust')}>Rust</div>
                    <div className="option-iris" onClick={() => handleColorClick('Iris')}>Iris</div>
                    <div className="option-copper" onClick={() => handleColorClick('Copper')}>Copper</div>
                    <div className="option-sky" onClick={() => handleColorClick('Sky')}>Sky</div>
                    <div className="option-cobalt" onClick={() => handleColorClick('Cobalt')}>Cobalt</div>
                    <div className="option-default" onClick={() => handleColorClick('Default')}>Default</div>
                </div>
            }
        </div>
     );
})
 
export default ColorSelector;

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.