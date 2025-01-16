import { render, screen } from '@testing-library/react';
import App from './App';
// "./...." means in the same folder, the file with the name ....

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
