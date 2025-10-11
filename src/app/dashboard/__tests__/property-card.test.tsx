import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PropertyCard } from '../property-card';
import { Property } from '@/types/property';

// Mock the Server Action
vi.mock('../actions', () => ({
  updatePropertyStatus: vi.fn(),
}));

const mockProperty: Property = {
  id: 'test-property',
  name: 'Test Property',
  address: '123 Test Street',
  units: 20,
  status: 'pending',
  lastInspection: '2024-01-01',
  nextInspection: '2024-02-01',
  maintenanceScore: 75,
  tasks: {
    completed: 5,
    pending: 3,
    overdue: 1,
  },
  issues: ['Test issue'],
};

describe('PropertyCard Component', () => {
  it('should render property information correctly', () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getAllByText('Test Property')).toHaveLength(1);
    expect(screen.getAllByText('123 Test Street')).toHaveLength(1);
    expect(screen.getAllByText('20 units')).toHaveLength(1);
  });

  it('should display maintenance score', () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getAllByText('75%')).toHaveLength(2);
  });

  it('should show issues when present', () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getAllByText('Test issue')).toHaveLength(3);
  });

  it('should display inspection dates', () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getAllByText('Last: 2024-01-01')).toHaveLength(4);
    expect(screen.getAllByText('Next: 2024-02-01')).toHaveLength(4);
  });

  it('should have proper accessibility attributes', () => {
    render(<PropertyCard property={mockProperty} />);

    const cards = screen.getAllByRole('article');
    expect(cards.length).toBeGreaterThan(0);

    const firstCard = cards[0];
    expect(firstCard.getAttribute('aria-labelledby')).toBe(
      'property-test-property-title',
    );
    expect(firstCard.getAttribute('tabIndex')).toBe('0');
  });
});
