import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KpiCard } from './KpiCard';
import React from 'react';

describe('KpiCard', () => {
  it('renders loading skeleton when loading is true', () => {
    render(<KpiCard title="Total Revenue" value="$50,000" loading={true} />);
    // The skeleton has a specific wrapper with `animate-pulse`
    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).not.toBeNull();
    // Content should not be visible
    expect(screen.queryByText('Total Revenue')).toBeNull();
    expect(screen.queryByText('$50,000')).toBeNull();
  });

  it('renders title and value when not loading', () => {
    render(<KpiCard title="Total Revenue" value="$50,000" loading={false} />);
    expect(screen.getByText('Total Revenue')).not.toBeNull();
    expect(screen.getByText('$50,000')).not.toBeNull();
  });

  it('does not render change when not provided', () => {
    render(<KpiCard title="New Customers" value="300" loading={false} />);
    // The change element is a `p` tag with a specific class, we can query for that
    const cardContent = screen.getByText('New Customers').closest('div');
    // `ml-2` is a unique class for the change indicator
    const changeElement = cardContent?.querySelector('.ml-2');
    expect(changeElement).toBeNull();
  });

  it('renders increase change with correct style', () => {
    render(
      <KpiCard
        title="Conversion Rate"
        value="5.2%"
        change="+10%"
        changeType="increase"
        loading={false}
      />
    );
    const changeElement = screen.getByText('+10%');
    expect(changeElement).not.toBeNull();
    expect(changeElement.className).toContain('text-green-600');
  });

  it('renders decrease change with correct style', () => {
    render(
      <KpiCard
        title="Bounce Rate"
        value="20%"
        change="-5%"
        changeType="decrease"
        loading={false}
      />
    );
    const changeElement = screen.getByText('-5%');
    expect(changeElement).not.toBeNull();
    expect(changeElement.className).toContain('text-red-600');
  });
});
