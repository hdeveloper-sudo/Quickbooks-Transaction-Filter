// ==UserScript==
// @name         Hide transactions from Quickbook
// @namespace    http://tampermonkey.net/
// @version      2024-12-19
// @description  Great for businesses who have multiple accountants working on different kinds of transactions
// @author       You
// @match        https://qbo.intuit.com/app/banking
// @icon         https://www.google.com/s2/favicons?sz=64&domain=intuit.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // List of filter words. Feel free to change
    const filterWords: string[] = [
        "deposit",
        "withdrawal",
        "refund",
        "overdraw",
        "interest",
        "westpac"
    ];

    // Configure whether to use filterWords as Blacklist or Whitelist
    const blacklist: boolean = true; // change to false to use filterWords as whitelist instead

    setInterval(function() {
        if(document.getElementsByClassName('idsTable__columnGroup')[1] !== undefined){
            // Class name of transaction table, subject to change by Quickbooks
            var table: HTMLTableElement = document.getElementsByClassName('idsTable__columnGroup')[1] as HTMLTableElement;
            // Loop through each row
            for (let r = table.rows.length - 1; r >= 0; r--) {
                // Check if the row is a data (and not a month heading), as only row heading have the class name 'group-header-row'
                if (!table.rows[r].classList.contains('group-header-row')) {
                    if (blacklist) {
                        // Use Blacklist
                        Blacklist(table, r);
                    } else {
                        // Use Whitelist
                        Whitelist(table, r);
                    }
                }
            }

            // Count and display the new number of transactions
            // Find the heading of each month
            var montheadings: HTMLTableRowElement[] = Array.from(document.getElementsByClassName('group-header-row')) as HTMLTableRowElement[];
            var tablerows: HTMLTableRowElement[] = Array.from(document.getElementsByClassName('idsTable__columnGroup')[1].querySelectorAll('tr')) as HTMLTableRowElement[];
            // Count the number of rows between each month heading, and between last month heading and end of table for last month
            for (var i = 0; i < montheadings.length; i++) {
                var numofTransactions: number;
                if (i < (montheadings.length - 1)) {
                    numofTransactions = Math.abs(tablerows.indexOf(montheadings[i]) - tablerows.indexOf(montheadings[i + 1])) - 1;
                } else {
                    numofTransactions = Math.abs(tablerows.indexOf(montheadings[i]) - tablerows.indexOf(tablerows[tablerows.length - 1]));
                }
                if (numofTransactions == 0) {
                    // Clear month heading if there are no transactions left for that month after filtering
                    table.deleteRow(tablerows.indexOf(montheadings[i]));
                } else {
                    // Replace heading with number of items based on number of rows
                    var part: string[] = montheadings[i].innerHTML.split('(');
                    if (part.length > 1) {
                        part[1] = numofTransactions + ')';
                    }
                    montheadings[i].innerHTML = part.join('(');
                }
            }
        }
}, 1000);

    // Instructions to Blacklist filterWords using selected table and current iteration
    function Blacklist(table: HTMLTableElement, r: number) {
        // Loop through each filterWord
        filterWords.forEach(filterWord => {
            // Remove entire row if 2nd column (being the description) of each row contains one of the filter words
            if (table.rows[r].cells[2].innerHTML.toLowerCase().indexOf(filterWord) !== -1) {
                table.deleteRow(r);
            }

        })
    }

    // Instructions to Whitelist filterWords using selected table and current iteration
    function Whitelist(table: HTMLTableElement, r: number) {
        // Initiate remove to true, to tell program to delete the row by default
        let remove: boolean = true;
        // Loop through each filterWord
        filterWords.forEach(filterWord => {
            // Check if the filterWord in the current iteration is in this row
            if (table.rows[r].cells[2].innerHTML.toLowerCase().indexOf(filterWord) !== -1) {
                // If the filterWord exists, set deleterow to false so the program does NOT delete the row
                remove = false;
            }
        })
        // If deleterow remains true after going through all filterWords, delete the row
        if (remove) {
            table.deleteRow(r);
        }
    }
})();
