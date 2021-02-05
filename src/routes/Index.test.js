import { render } from '@testing-library/svelte'
import { expect } from 'chai'
import Index from './Index.svelte'

describe('<Index>', () => {
  it('renders the title', () => {
    const { getByText } = render(Index)
    const linkElement = getByText(/weather station/i)
    expect(document.body.contains(linkElement))
  })
})
