import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import useLocalStorageState from "use-local-storage-state";
import { initialGoals } from "@/ressources/data";
import { formatDate } from "../utils/normalizeUtils.js";
import Navbar from "@/components/Nav/Nav";
import GoalsCard from "@/components/GoalsCard/GoalsCard.js";
import GoalsForm from "@/components/Forms/GoalForm.js";
import Modal from "@/components/Modal";
import TransactionForm from "@/components/Forms/TransactionForm.js";
import {
  StyledHeading,
  StyledText,
  StyledCardContainer,
  StyledSavingContainer,
  Main,
  ActionButtonGoalsPage,
  StyledAllButtonsContainer,
  StyledTotalSavingContainer,
  HeadingWrapper,
} from "@/styles";

export default function Goals({ transactions, onAddTransaction }) {
  const [goals, setGoals] = useLocalStorageState("goals", {
    defaultValue: initialGoals,
  });
  const [totalSavings, setTotalSavings] = useState(0);
  const [modalType, setModalType] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  function handleCloseModal() {
    setModalType(null);
  }
  function renderModalContent() {
    if (modalType === "add saving goal") {
      return (
        <GoalsForm
          onCloseModal={handleCloseModal}
          onSaveGoal={handleSaveGoal}
          savingBalance={savingsTransferSum + totalSavings}
        />
      );
    } else if (modalType === "edit saving goal") {
      return (
        <GoalsForm
          onCloseModal={handleCloseModal}
          onSaveGoal={handleSaveGoal}
          savingBalance={savingsTransferSum + totalSavings}
          goal={editingGoal}
        />
      );
    } else if (modalType === "savings withdrawal") {
      return (
        <TransactionForm
          onAddTransaction={onAddTransaction}
          formType="savings withdrawal"
          onCloseModal={handleCloseModal}
          savingsTransferSum={savingsTransferSum}
        />
      );
    }
  }

  function handleEditGoal(goal) {
    setModalType("edit saving goal");
    setEditingGoal(goal);
  }

  function handleSaveGoal(goalToSave) {
    if (goalToSave.id) {
      const originalGoal = goals.find((goal) => goal.id === goalToSave.id);
      if (originalGoal) {
        const difference =
          parseInt(goalToSave.savedAmount) - parseInt(originalGoal.savedAmount);
        const transactionForEdit = {
          id: uuidv4(),
          amount: -difference,
          category: "Savings transfer",
          date: formatDate(new Date()),
          description: "Edited saving goal",
          type: "Saving",
          internalGoalAllocation: "yes",
        };
        onAddTransaction(transactionForEdit);
      }
      setGoals(
        goals.map((goal) => (goal.id === goalToSave.id ? goalToSave : goal))
      );
    } else {
      const transactionForNewGoal = {
        id: uuidv4(),
        amount: -parseInt(goalToSave.savedAmount),
        category: "Savings transfer",
        date: formatDate(new Date()),
        description: "New saving goal",
        type: "Saving Goal",
      };
      onAddTransaction(transactionForNewGoal);
      setGoals((currentGoals) => [
        { ...goalToSave, id: uuidv4() },
        ...currentGoals,
      ]);
    }
  }

  function handleDeleteGoal(id) {
    const goalData = goals.find((goal) => goal.id === id);
    onAddTransaction({
      ...transactions,
      amount: parseInt(goalData.savedAmount),
      category: "Savings transfer",
      type: "Saving Goal",
    });
    setGoals((goals) => goals.filter((goal) => goal.id !== id));
  }

  useEffect(() => {
    const totalSavedAmount = goals.reduce(
      (sum, goal) => sum + parseInt(goal.savedAmount),
      0
    );
    setTotalSavings(totalSavedAmount);
  }, [goals]);

  function calculateSavingsTransfers(transactions) {
    return transactions
      .filter((transaction) => transaction.category === "Savings transfer")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }
  const savingsTransferSum = calculateSavingsTransfers(transactions);
  return (
    <>
      {modalType && <Modal>{renderModalContent()}</Modal>}
      <HeadingWrapper>
        <StyledHeading>Saving Goals</StyledHeading>
      </HeadingWrapper>
      <Main>
        <StyledCardContainer>
          <StyledSavingContainer>
            Current Savings Balance: {savingsTransferSum}
          </StyledSavingContainer>

          <StyledAllButtonsContainer>
            <ActionButtonGoalsPage
              onClick={() => setModalType("savings withdrawal")}
            >
              Transfer back to Account
            </ActionButtonGoalsPage>
            <ActionButtonGoalsPage
              onClick={() => setModalType("add saving goal")}
            >
              Add Goal
            </ActionButtonGoalsPage>
          </StyledAllButtonsContainer>
          <GoalsCard
            goals={goals}
            onHandleDeleteGoal={handleDeleteGoal}
            onEditGoal={handleEditGoal}
          />
          {goals.length === 0 && (
            <StyledText>{`You do not have any Goals added yet. `}</StyledText>
          )}
        </StyledCardContainer>
        <StyledTotalSavingContainer>
          Total Saved Amount: {totalSavings}
        </StyledTotalSavingContainer>
      </Main>
      <Navbar />
    </>
  );
}
