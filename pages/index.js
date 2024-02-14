import Form from "@/components/Form/Form";
import List from "@/components/List/List";
import FilterButtons from "@/components/FilterButtons/FilterButtons";
import { useState } from "react";
import { StyledHeading, StyledAmoutDisplay } from "@/styles";

export default function HomePage({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
}) {
  const [transactionFilter, setTransactionFilter] = useState("all");

  function handleSetFilter(filter) {
    setTransactionFilter(filter);
  }

  function filterTransactions(transactions) {
    if (transactionFilter === "all") {
      return transactions;
    } else {
      return transactions.filter(
        (transaction) => transaction.type === transactionFilter
      );
    }
  }

  const filteredTransactions = filterTransactions(transactions);

  function calculateSum(transactions) {
    return transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
  }

  function displayTotalSum(filter) {
    if (filter === "all") {
      return null;
    }


   

    const sum = calculateSum(filteredTransactions(transactions));
    let text = "";

    if (filter === "Income") {
      text = "Sum of all Incomes: ";
    } else if (filter === "Expense") {
      text = "Sum of all Expenses: -";
    }

    return (
      <StyledAmoutDisplay>
        {text}
        {sum} EUR
      </StyledAmoutDisplay>
    );
  }

  function calculateBalance() {
    let balance = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "Income") {
        balance += transaction.amount;
      } else {
        balance -= transaction.amount;
      }
    });

    return balance;

  }

  return (
    <div>
      <StyledHeading>Budget Buddy</StyledHeading>
      <Form onAddTransaction={onAddTransaction} />
      <FilterButtons onHandleSetFilter={handleSetFilter} />
      {displayTotalSum(transactionFilter)}
      {transactionFilter === "all" && (
        <div>Balance: {calculateBalance()} EUR</div>
      )}
      <List
        transactions={
          transactionFilter !== "all" ? filteredTransactions : transactions
        }
        onDeleteTransaction={onDeleteTransaction}
      />
    </div>
  );
}
