import { useState } from "react";
import { useEffect } from "react";
import EventList from "./EventList";
import '../styles/CollapsibleEventlist.css';

/**
 * Represents a collapsible list of event lists. Used to populate the main page.
 * Due to a shift in direction from when the project started and me not wanting
 * to rebuild this component from the ground up, must be forced to
 * rerender anytime a chunk of older or newer lists is to be viewed.
 * 
 * Params:
 *  title-String: The list's title
 */
const CollapsibleEventList = ({title, eventLists, getOlder, getNewer}) => {

    const [isActive, setIsActive] = useState(false);
    const [page, setPage] = useState(0); // The current page of lists the user is on
    const [pageCount, setPageCount] = useState(0); // The total number of pages needed to display all lists at the current items per page value
    const [itemsPer, setItemsPer] = useState(5); // The number of lists to display per page
    const [pageLists, setPageLists] = useState([]); // The lists to be displayed on the current page
    const [activeLists, setActiveList] = useState(eventLists); // A subset of lists that reflects a current search
    const [activeSearch, setActiveSearch] = useState(false);
    const [sortState, setSortState] = useState(0); // 0 for none, 1 for ascending/high to low/new to old, 2 for descending/low to high/old to new
    const [preSortLists, setPreSortLists] = useState([]);

    /**
     * Handles opening and closing the menu, just flips the useState
     */
    const handleCollapseClick = () => {
        setIsActive(current => !current);
    }

    /** 
     * Updates the page count and page lists everytime anything page or master list related is updated
     */
    useEffect(() => {

        setPageCount(activeLists.length / itemsPer);
        setPageLists(activeLists.slice((itemsPer * page), ((page + 1) * itemsPer)));

    }, [pageCount, itemsPer, page, activeLists]);

    /**
     * Sets the current page to zero
     */
    const pageToZero = () => {
        setPage(0);
    }

    /**
     * Sets the current page on backwards
     */
    const pageLeft = () => {
        setPage(page - 1);
    }

    /**
     * Sets the current page one further
     */
    const pageRight = () => {
        setPage(page + 1);
    }

    /**
     * Sets the current page to its highest possible value
     */
    const pageToMax = () => {

        let roundedPageCount = Math.floor(pageCount);

        // Accounting for decimals
        if ( pageCount % 1 !== 0)
        {
            setPage(roundedPageCount);
        }
        else
        {
            setPage(roundedPageCount - 1) 
        }
        
    }

    /**
     * Updates itemsPer based on selection and set current page to zero to reduce user confusion
     */
    const handleItemsPerSelection = (newItemsPer) => {
        setPage(0);
        setItemsPer(newItemsPer);
    }

    /**
     * Handles all the list searching by checking if the selected property contains the inputted string
     */
    const handleListSearch = (event) => {

        /**
         * Loops through all tags and checks each one, stopping at first match.
         * Sectioned off because more logic is needed to handle an array than string properties.
         */
        function checkListTags(value)
        {
            let tags = value["tags"];

            for (var i = 0; i < tags.length; i += 1)
            {
                if (tags[i].toLowerCase().includes(query.toLowerCase()))
                {
                    searchArr = [...searchArr, value];
                    break;
                }
                
            }
        }

        event.preventDefault();
        let query = event.target.elements.listQuery.value;
        let field = event.target.elements.searchField.value;
        let searchArr = [];

        // Checks the property for the string
        if (field !== "tags")
        {
            searchArr = eventLists.filter((list) => { if (list[field].toLowerCase().includes(query.toLowerCase())) return true});
        }
        else
        {
            eventLists.forEach(checkListTags);
        }
        
        setActiveSearch(true);
        setActiveList(searchArr);
        setPage(0);
    }

    /**
     * Clears search tracking, resets the list back to the master list, and sets page to zero
     */
    const cancelSearch = () => {
        setActiveSearch(false);
        setActiveList(eventLists);
        setPage(0);
    }

    /**
     * Handles sorting by making an ordered copy of the current list (master or search)
     */
    const handleSort = (event) => {
        
        let property = event.target.elements.sort.value;
        let sortedArray = [];

        // Saving pre sort list state incase reset
        setPreSortLists([...activeLists]);

        event.preventDefault();

        // Different sorts needed by property
        switch (property)
        {
            case 'title':
            case 'author':
                // Sorts acending by default
                sortedArray = activeLists.toSorted(function(a, b) {
                    return a[property].toLowerCase().localeCompare(b[property].toLowerCase());
                } )
                break;
            case 'positive':
                // High to low by default
                sortedArray = activeLists.toSorted(function(a, b) {
                    return b["rating"][0] - a["rating"][0];
                })
                break;
            case 'negative':
                // High to low by default
                sortedArray = activeLists.toSorted(function(a, b) {
                    return b["rating"][1] - a["rating"][1];
                })
                break;
            case 'events':
                // High to low by default
                sortedArray = activeLists.toSorted(function(a, b) {
                    return b["events"].length - a["events"].length;
                })
                break;
            case 'date':
                // New to old by default
                sortedArray = activeLists.toSorted(function(a, b) {
                    return new Date(b["createdAt"]) - new Date(a["createdAt"]);
                })
                break;

        }

        setSortState(1);
        setActiveList(sortedArray);

    }

    /**
     * Reverses a current sort
     */
    const reverseSort = () => {

        setActiveList(activeLists.toReversed());

        if (sortState === 1)
        {
            setSortState(2);
        }
        else if (sortState === 2)
        {
            setSortState(1);
        }

    }

    /**
     * Clears a sort by returning activeLists to the presort array
     */
    const clearSort = () => {
        setActiveList([...preSortLists]);
        setSortState(0);
    }

    /**
     * UI
     */
    return (
        <div className="collapsible-event-list">
            <button className="collapsible-button" style={isActive ? 
            {   borderBottomRightRadius: '0px',
                borderBottomLeftRadius: '0px',
                backgroundColor: '#C73032'}
            : 
            {   }} onClick={handleCollapseClick}>
                <img style={isActive ? {rotate: '180deg'} : {} } src={require("./..\\img\\collapseArrow.png")} alt="" />
                <h2>{title}</h2>
            </button>
            <div className="collapsible-content" style={isActive ? { height: 'auto'} : {height: '0px'}}>
                <div style={{backgroundColor: '#C73032', paddingBottom: '20px'}}>
                    <div className="collapsible-sort-container">
                        <form onSubmit={handleSort} style={{display: 'flex', alignItems: 'center'}}>
                            <label htmlFor="sort">Sort by:</label>
                            <select name="sort" id="sort">
                                <option value="title">Title</option>
                                <option value="author">Author</option>
                                <option value="positive">Positive Ratings</option>
                                <option value="negative">Negative Ratings</option>
                                <option value="events">Number of Events</option>
                                <option value="date">Creation Date</option>
                            </select>
                            {sortState === 0 && <button type="submit"><img src={require("./..\\img\\sort.png")} alt="" /></button>}
                            {sortState !== 0 && <button type="button" onClick={reverseSort}><img src={require("./..\\img\\upArrow.png")} style={sortState === 1 ? {} : {rotate: '180deg'}} alt="" /></button>}
                            {sortState !== 0 && <button type="button" onClick={clearSort}><img src={require("./..\\img\\closeBlack.png")} alt="" /></button>}
                        </form>
                        <form onSubmit={handleListSearch} className="search-form">
                            <div>
                                <label htmlFor="listQuery">Search for:</label>
                                <input type="text" name="listQuery" id="listQuery" required={true}/>
                            </div>
                            <div>
                                <p>in:</p>
                                <select name="searchField" id="searchField">
                                    <option value="title">Title</option>
                                    <option value="author">Author</option>
                                    <option value="description">Description</option>
                                    <option value="tags">Tags</option>
                                </select>
                                {!activeSearch && <button type='submit'><img src={require("./..\\img\\search.png")} alt="" /></button>}
                                {activeSearch && <button onClick={cancelSearch}><img src={require("./..\\img\\closeBlack.png")} alt="" /></button>}
                            </div>
                        </form>
                    </div>
                </div>
                
                {pageLists.length < 1 && <h1 className="empty-message">No Lists Found</h1>}
                {pageLists && pageLists.map((eventList) => (
                    <EventList key={eventList._id} eventList={eventList} />
                ))}
                <div className="collapsible-footer">
                    <label htmlFor="items">Items per page: </label>
                    <select name="items" id="items" value={itemsPer} onChange={(e) => handleItemsPerSelection(e.target.value)}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        {(getNewer) && (page === 0) && 
                        <div>
                            <button onClick={getNewer}>See Newest Events</button>
                        </div>}
                        {(page !== 0) && 
                        <div>
                            <button onClick={pageToZero}><img src={require("./..\\img\\leftStart.png")} alt="" /></button>
                            <button onClick={pageLeft}><img src={require("./..\\img\\pageLeft.png")} alt="" /></button>
                        </div>}  
                    </div>
                    <div className="page-num-container"> 
                        <p className="page-num" onClick={() => setPage(0)} style={page > 2 ? {visibility:'visible'} : {visibility: 'hidden'}}>...</p>
                        <p className="page-num" onClick={() => setPage(page - 2)} style={page > 1 ? {visibility:'visible'} : {visibility: 'hidden'}}>{page - 1}</p>
                        <p className="page-num" onClick={() => setPage(page - 1)} style={page > 0 ? {visibility:'visible'} : {visibility: 'hidden'}}>{page}</p>
                        <p className="curr-page-num">{page + 1}</p>
                        <p className="page-num" onClick={() => setPage(page + 1)} style={page < pageCount - 1 ? {visibility:'visible'} : {visibility: 'hidden'}}>{page + 2}</p>
                        <p className="page-num" onClick={() => setPage(page + 2)} style={page < pageCount - 2 ? {visibility:'visible'} : {visibility: 'hidden'}}>{page + 3}</p>
                        <p className="page-num" onClick={() => setPage(Math.floor(pageCount))} style={page < pageCount - 3 ? {visibility:'visible'} : {visibility: 'hidden'}}>...</p>
                    </div>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        {((pageCount % 1 !== 0 && page !== Math.floor(pageCount)) || (pageCount % 1 === 0 && page !== Math.floor(pageCount - 1))) && 
                        <div>
                            <button onClick={pageRight} ><img src={require("./..\\img\\pageRight.png")} alt="" /></button>
                            <button onClick={pageToMax} ><img src={require("./..\\img\\rightEnd.png")} alt="" /></button>
                        </div>}
                        {((getOlder) && !(eventLists.length < 1) && ((pageCount % 1 !== 0 && page === Math.floor(pageCount)) || (pageCount % 1 === 0 && page === Math.floor(pageCount - 1)))) &&
                        <div>
                            <button onClick={getOlder}>Show Older Events</button>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CollapsibleEventList;

//© 2025 Daxton Sutherland <daxtonass77@gmail.com>, all rights reserved.