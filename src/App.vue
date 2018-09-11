<template>
  <div class="container" id="app">
    <div class="row">
      <div class="col s12">
        <div class="center">
          <h2> {{ appName }} </h2>
          <h5> Vue component to navigate files and folders with selection capability </h5>

          <p>
            If your application has a need for displaying lists of files in hierarchical fasion,
            then this is the component you're looking for!
          </p>
          <h3> Features </h3>
            <ul>
              <li>Supports shift-selection and control-selection</li>
              <li>
                Beautiful icons from
                <a href="https://github.com/file-icons/atom" target="_blank">atom</a>
              </li>
              <li>
                Easy extensibility through events
              </li>
            </ul>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col offset-s3 s6">
          <h3> Sandbox </h3>
          <p> You can test the functionality of {{ appName }} below </p>
          <div class="explorer">
            <ul style="list-style-type: none;">
              <vue-file-explorer v-for="(mount, $index) in mountPoints" :key="mount.name"
                :index="$index"
                :absolute-path="mount.absolutePath"
                :is-directory="mount.isDirectory"
                :name="mount.name"
                :children="mount.children"
                @selected="onSelect"
                @update-directory="onUpdateDirectory"/>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col s12">
        <span>Selected entries: {{ displaySelectedEntries }} </span>
      </div>
    </div>
  </div>
</template>

<script>
import VueFileExplorer from './components/vue-file-explorer'
export default {
  components: {
    'vue-file-explorer': VueFileExplorer
  },
  data () {
    return {
      appName: 'File Explorer',
      mountPoints: [
        {
          name: '/home',
          isDirectory: true,
          children: [
            {
              name: 'Downloads',
              isDirectory: true,
              children: [
                {
                  name: 'icon-pack.zip',
                  isDirectory: false
                },
                {
                  name: 'README.md',
                  isDirectory: false
                },
                {
                  name: 'form-37742.docx',
                  isDirectory: false
                }
              ]
            },
            {
              isDirectory: true,
              name: 'Workspace',
              children: [
                {
                  name: 'file-browser',
                  isDirectory: true,
                  children: [
                    {
                      name: 'src',
                      isDirectory: true,
                      children: [
                        {
                          name: 'assets',
                          isDirectory: true,
                          children: [
                            {
                              name: 'favicon.ico',
                              isDirectory: false
                            }
                          ]
                        },
                        {
                          name: 'components',
                          isDirectory: true,
                          children: [
                            {
                              name: 'entry.vue',
                              isDirectory: false
                            }
                          ]
                        },
                        {
                          name: 'views',
                          isDirectory: true,
                          children: []
                        },
                        {
                          name: 'App.vue',
                          isDirectory: false
                        },
                        {
                          name: 'main.js',
                          isDirectory: false
                        },
                        {
                          name: 'router.js',
                          isDirectory: false
                        },
                        {
                          name: 'store.js',
                          isDirectory: false
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              absolutePath: `D:\\Videos\\2016\\vacation.mp4`,
              isDirectory: false,
              name: 'vacation.mp4'
            }
          ]
        },
        {
          name: '/usr',
          isDirectory: true,
          children: [
            {
              name: 'lib',
              isDirectory: true,
              children: [
                {
                  name: 'libau.so',
                  isDirectory: false
                }
              ]
            }
          ]
        }
      ],
      selected: []
    }
  },
  computed: {
    displaySelectedEntries () {
      return this.selected.map(entry => entry.querySelector('.name').textContent)
    }
  },
  methods: {
    clearAllSelected () {
      this.selected.forEach(entry => (entry.dataset.selected = 'false'))
      this.selected = []
    },
    onSelect ([evt, component]) {
      var ignoreSelect = false
      var entries = [evt.target.closest('.entry')]

      if (evt.shiftSelect) {
        // Ensure that this element and other selected elements have the same parent
        // If not, ignore this click
        // Since we do this for every multi-select, it is sufficient to just check
        // the parent of the 0th element
        const entry = entries[0]
        const parent = entry.parentNode.closest('.entry')
        // Find all contiguous entries between the last selected entry and the currently selected entry
        // First, get the top-most selected entry
        const lastSelectedEntry = this.selected.splice(-1)[0]
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

      if (!evt.multiSelect) {
        // Clear out the selected array
        this.clearAllSelected()
      }

      if (ignoreSelect) {
        return
      }
      entries.forEach(entry => {
        entry.dataset.selected = 'true'
        this.selected.push(entry)
      }, this)
    },
    onUpdateDirectory (data) {

    }
  }
}
</script>

<style lang="scss">

.explorer {
  background-color: rgb(33, 37, 43);
  color: rgb(157, 165, 180);
  margin: 0;
  padding: 5px 15px;
}

.entry[data-selected="true"] > .label-container {
  background-color: #4d78cc;
  color: #fff !important;
}

.entry {
  position: relative;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                        supported by Chrome and Opera */
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
