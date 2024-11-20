import { render, screen } from '@testing-library/react';

const SampleComponent = () => <div>Hello, World!</div>;

describe('SampleComponent', () => {
  it('renders the text "Hello, World!"', () => {
    render(<SampleComponent />);
    expect(screen.getByText(/hello, world!/i)).toBeInTheDocument();
  });
});
