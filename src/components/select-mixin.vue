<script>
export default {
  data () {
    return {
      selected: [],
      selectMixinSelectedSet: new Set()
    }
  },
  methods: {
    clearAllSelected () {
      this.selected.forEach(entry => (entry.dataset.selected = 'false'))
      this.selected = []
      this.selectMixinSelectedSet = new Set()
    },
    onSelect ({ event, paths, component }) {
      var ignoreSelect = false
      var entries = [event.target.closest('.entry')]

      if (event.shiftSelect) {
        // Ensure that this element and other selected elements have the same parent
        // If not, ignore this click
        // Since we do this for every multi-select, it is sufficient to just check
        // the parent of the 0th element
        const entry = entries[0]
        const parent = entry.parentNode.closest('.entry')
        // Find all contiguous entries between the last selected entry and the currently selected entry
        // First, get the top-most selected entry
        const lastSelectedEntry = this.selected.slice(-1)[0]
        try {
          const children = parent.children
          const childrenArray = Array.from(children)
          const lastSelectedEntryIdx = childrenArray.indexOf(lastSelectedEntry.parentNode)
          const currentIndex = childrenArray.indexOf(entry.parentNode)
          const minIdx = Math.min(lastSelectedEntryIdx, currentIndex)
          const maxIdx = Math.max(lastSelectedEntryIdx, currentIndex)
          entries = childrenArray.map((entry, idx) => idx >= minIdx && idx <= maxIdx ? entry.querySelector('.entry') : undefined).filter(x => !!x)
        } catch (e) {
        }
      }

      if (!event.multiSelect) {
        // Clear out the selected array
        this.clearAllSelected()
      }

      if (ignoreSelect) {
        return
      }
      entries.forEach(entry => {
        entry.dataset.selected = entry.dataset.selected !== 'true' ? 'true' : 'false'
        switch (entry.dataset.selected) {
          case 'true':
            if (!this.selectMixinSelectedSet.has(entry)) {
              this.selected.push(entry)
              this.selectMixinSelectedSet.add(entry)
            }
            break
          case 'false':
            if (this.selectMixinSelectedSet.has(entry)) {
              this.selected.splice(this.selected.indexOf(entry), 1)
              this.selectMixinSelectedSet.delete(entry)
            }
            break
        }
      }, this)
    }
  }
}
</script>
