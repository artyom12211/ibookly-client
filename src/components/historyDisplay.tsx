import { useHistoryStack } from './historyContext';

function HistoryDisplay() {
  const { historyStack } = useHistoryStack();

  return (
    <div>
      <p>Количество маршрутов в истории: {historyStack.length}</p>
      <p>История: {historyStack.join(' -> ')}</p>
    </div>
  );
}

export default HistoryDisplay;