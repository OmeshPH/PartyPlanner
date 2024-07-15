const partyTable = document.getElementById('party-data');
const addPartyForm = document.getElementById('add-party-form');

// State Array to store party information retrieved from the API
const state= {
  parties: []
}
// API endpoint URL where party data is retrieved and new parties are added
const apiUrl = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2406-FTB-ET-WEB-FT/events';

// Function to fetch party data from the API (GET request)
async function getParties() {
  try {
    // Fetches party data from the API endpoint
    const response = await fetch(apiUrl);

    // Checks if the API request was successful
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Parses the response data as JSON format
    const data = await response.json();

    // Checks if the data structure from the API is valid (has success and data properties)
    if (!data.success || !data.data) {
      console.error('Error: Invalid data structure in response');
      return;
    }

    // Updates the state (parties array) with the fetched party information
    parties = data.data;

    // Calls the displayParties function to update the table with the new data
    displayParties();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to display parties in the table
function displayParties() {
  // Clears the existing content of the table
  partyTable.innerHTML = '';

  // Loops through each party in the state (parties array)
  parties.forEach(party => {
    const tableRow = document.createElement('tr'); // Creates a new table row

    // Creates table cells for each party property (name, date, time, etc.)
    const nameCell = document.createElement('td');
    nameCell.textContent = party.name;
    tableRow.appendChild(nameCell);

    const dateCell = document.createElement('td');
    dateCell.textContent = party.date ? new Date(party.date).toLocaleDateString() : 'N/A';
    tableRow.appendChild(dateCell);

    const timeCell = document.createElement('td');
    timeCell.textContent = party.time ? new Date(party.time).toLocaleTimeString() : 'N/A';
    tableRow.appendChild(timeCell);

    const locationCell = document.createElement('td');
    locationCell.textContent = party.location ? party.location : 'N/A';
    tableRow.appendChild(locationCell);

    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = party.description ? party.description : 'N/A';
    tableRow.appendChild(descriptionCell);

    // Creates an action cell with a "Delete" button for each party
    const actionCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteParty(party.id));
    actionCell.appendChild(deleteButton);
    tableRow.appendChild(actionCell);

    // Appends the newly created table row to the party table element
    partyTable.appendChild(tableRow);
  });
}

// Function to handle adding a new party (POST request)
async function addParty(partyDetails) {
  const response = await fetch(apiUrl, {
    method: 'POST', // Indicates a POST request to create a new party
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partyDetails) // Converts party details object to JSON format for the request body
  });

  if (response.ok) {
    const newParty = await response.json();
    parties.push(newParty); // Updates state with the newly created party
    displayParties();
    addPartyForm.reset(); // Clears the form after successful addition
  } else {
    alert('Error adding party');
  }
}

// Function to handle deleting a party (DELETE request)
async function deleteParty(partyId) {
    const response = await fetch(`${apiUrl}/${partyId}`, {
      method: 'DELETE' // Indicates a DELETE request to remove a party
    });
  
    if (response.ok) {
      // Filters the state (parties array) to exclude the deleted party based on its ID
      parties = parties.filter(party => party.id !== partyId);
      displayParties(); // Updates the table to reflect the deletion
    } else {
      alert('Error deleting party');
    }
  }
  
  // Event listener for form submission (prevent default, get form data, call addParty)
  addPartyForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents default form submission behavior
  
    // Creates an object to store party details from the form
    const partyDetails = {
      name: document.getElementById('party-name').value,
      date: document.getElementById('party-date').value,
      time: document.getElementById('party-time').value, 
      location: document.getElementById('party-location').value,
      description: document.getElementById('party-description').value
    };
  
    // Calls the addParty function to create a new party using the form data
    addParty(partyDetails);
  });
  
  // Call getParties on page load to fetch initial data
  getParties();