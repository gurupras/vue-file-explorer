<template>
  <ol class="entry-container">
    <li :class="['entry', isDirectory ? 'directory' : 'file', expanded ? 'expanded' : 'collapsed']">
      <div class="label-container" @click="onClick">
        <div class="arrow" v-if="isDirectory">
          <font-awesome-icon :icon="expanded ? 'angle-down' : 'angle-right'"/>
        </div>
        <span class="label">
          <span v-if="icon">
            <svg-file-icon class="icon" :view-box="icon.svg.viewBox" :path="icon.svg.path" :style="{color: iconColor}"/>
          </span>
          <span class="name">{{ name }}</span>
        </span>
      </div>
      <vue-file-explorer v-show="expanded" v-if="isDirectory"
        v-for="(entry, $index) in childrenData"
        class="nested"
        :is-directory="entry.isDirectory"
        :name="entry.name"
        :children="entry.children"
        :file-icons="fileIcons"
        :key="$index"
        :index="$index"
        @selected="onSelect"
        @update-directory="updateDirectory"/>
    </li>
  </ol>
</template>

<script>
import { library as faLibrary } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { SvgFileIcons, library as fiLibrary } from '@gurupras/svg-file-icons'
import VueSvgFileIcon from './svg-file-icon'

faLibrary.add(faAngleDown)
faLibrary.add(faAngleRight)

const svgFileIcons = new SvgFileIcons()
svgFileIcons.addFolderIcon()

// fiLibrary.registerIconSet(devicons)
// fiLibrary.registerIconSet(fileIcons)
// fiLibrary.registerIconSet(fontawesome)
// fiLibrary.registerIconSet(mfizz)
// fiLibrary.registerIconSet(octicons)

export default {
  name: 'vue-file-explorer',
  components: {
    'font-awesome-icon': FontAwesomeIcon,
    'svg-file-icon': VueSvgFileIcon
  },
  props: {
    absolutePath: {
      type: String
    },
    isDirectory: {
      type: Boolean,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    children: {
      type: Array,
      default () {
        return []
      }
    },
    fileIcons: {
      type: Object,
      default () {
        return svgFileIcons
      }
    }
  },
  computed: {
    icon () {
      try {
        var icon
        if (this.isDirectory) {
          icon = this.fileIcons.getIconByCSSClass('folder-icon')
        } else {
          icon = this.fileIcons.getIcon(this.name)
        }
        return icon
      } catch (e) {
        return null
      }
    },
    iconColor () {
      var color = 'inherit'
      if (!this.icon || !this.icon.colour) {
        return color
      }
      const colors = this.icon.colour.filter(x => !!x)
      if (colors.length === 0) {
        return color
      }
      return colors[0]
    }
  },
  data () {
    return {
      childrenData: [],
      expanded: false
    }
  },
  methods: {
    toggle () {
      if (this.isDirectory) {
        this.updateDirectory({
          component: this,
          paths: []
        })
      }
      this.expanded = !this.expanded
    },
    async onClick (evt) {
      // We shouldn't toggle on shift/ctrl + click
      if (!evt.ctrlKey && !evt.shiftKey) {
        if (this.isDirectory) {
          this.toggle()
        }
      }
      evt = {
        multiSelect: evt.ctrlKey,
        shiftSelect: evt.shiftKey,
        target: evt.target
      }
      this.onSelect({
        event: evt,
        paths: [],
        component: this
      })
    },
    onSelect ({ event, paths, component }) {
      paths.unshift(this.name)
      this.$emit('selected', ...Array.from(arguments))
    },
    updateDirectory (data) {
      const path = this.absolutePath || this.name
      data.paths = [path, ...data.paths]
      this.$emit('update-directory', data)
    }
  },
  async beforeMount () {
    window.svgFileIcons = svgFileIcons
    window.library = fiLibrary
    this.childrenData.push(...this.children)
  }
}
</script>

<style scoped>

.entry {
  cursor: pointer;
  line-height: 1.5em;
  font-family: 'system-ui';
}

.entry > .nested > .entry {
  padding-left: 21px;
}

li.entry {
  text-align: initial;
}

.label-container {
  z-index: 1;
}

.label {
  position: relative;
  padding-left: 21px;
}

.arrow {
  display: inline-block;
  margin-right: 5px;
  font-size: 12px;
  width: 12px;
  height: 12px;
}

.icon {
  position: absolute;
  top: 0;
  left: 0;
  background-color: inherit !important;
  height: 18px;
}

.icon::before {
  line-height: 1;
  display: inline-block;
}

.entry.file {
  margin-left: 17px;
}

ol {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.icon::before {
  background-color: inherit !important;
}

.folder-icon:before {
  color: grey;
}

</style>
