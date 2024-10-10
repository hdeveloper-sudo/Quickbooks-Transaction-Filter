// ==UserScript==
// @name         Hide transactions from Quickbook by Keywords
// @namespace    http://tampermonkey.net/
// @version      2024-09-10
// @description  Customisable hiding transactions from the "for review" section of QuickBooks. Perfect for businesses handled by multiple accountants, with different people dealing with different kinds of transactions
// @author       Hugo Yu
// @match        https://qbo.intuit.com/app/banking
// @icon         https://www.google.com/s2/favicons?sz=64&domain=intuit.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(function() {
        if(document.getElementsByClassName('idsTable__columnGroup')[1] !== undefined){
            // List of filter words. Feel free to change
            const filterWords = [
                "deposit",
                "withdrawal",
                "refund"
            ];

            // Class name of transaction table, subject to change by Quickbooks
            var table = document.getElementsByClassName('idsTable__columnGroup')[1];
            filterWords.forEach(filterWord => {
                // Loop through each cell
                for (let r = table.rows.length - 1; r >= 0; r--) {
                    // Check if the row is a data (and not a month heading), as only row heading have the class name 'group-header-row'
                    if (!table.rows[r].classList.contains('group-header-row')) {
                        // Remove entire row if 2nd column (being the description) of each row contains the word 'deposit' or 'withdrawal'
                        if (table.rows[r].cells[2].innerHTML.toLowerCase().indexOf(filterWord) !== -1) {
                            table.deleteRow(r);
                        }
                    }
                }
            })

            // Count and display the new number of transactions
            // Find the heading of each month
            var montheadings = Array.from(document.getElementsByClassName('group-header-row'));
            var tablerows = Array.from(document.getElementsByClassName('idsTable__columnGroup')[1].querySelectorAll('tr'));
            // Count the number of rows between each month heading, and between last month heading and end of table for last month
            for (var i = 0; i < montheadings.length; i++) {
                var numofTransactions;
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
                    var part = montheadings[i].innerHTML.split('(');
                    if (part.length > 1) {
                        part[1] = numofTransactions + ')';
                    }
                    montheadings[i].innerHTML = part.join('(');
                }
            }
        }
}, 1000);
})();