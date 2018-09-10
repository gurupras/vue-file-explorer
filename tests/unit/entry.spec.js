import { shallowMount } from '@vue/test-utils'
import Entry from '@/components/entry.vue'

describe('Entry.vue', () => {
  it('renders name when passed', () => {
    const name = 'test'
    const wrapper = shallowMount(Entry, {
      props: {
        name,
        isDirectory: false
      }
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
