<template>
  <ol class="entry-container">
    <li :class="['entry', isDirectory ? 'directory' : 'file', expanded ? 'expanded' : 'collapsed']">
      <div class="label-container" @click="onClick">
        <div class="arrow" v-if="isDirectory">
          <font-awesome-icon :icon="expanded ? 'angle-down' : 'angle-right'"/>
        </div>
        <span class="label">
          <span :class="['icon', getIcon]"></span>
          <span class="name">{{ name }}</span>
        </span>
      </div>
      <vue-file-explorer v-show="expanded" v-if="isDirectory"
        v-for="(entry, $index) in children"
        class="nested"
        :is-directory="entry.isDirectory"
        :name="entry.name"
        :children="entry.children"
        :key="$index"
        :index="$index"
        @selected="onSelect"
        @update-directory="updateDirectory"/>
    </li>
  </ol>
</template>

<script>
import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import FileIcons from 'file-icons-js'

library.add(faAngleDown)
library.add(faAngleRight)

Vue.component('font-awesome-icon', FontAwesomeIcon)

export default {
  name: 'vue-file-explorer',
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
    index: {
      type: Number
    }
  },
  computed: {
    getIcon () {
      if (this.isDirectory) {
        return 'folder-icon'
      }
      return FileIcons.getClassWithColor(this.name)
    }
  },
  data () {
    return {
      expanded: false
    }
  },
  methods: {
    toggle () {
      if (this.isDirectory) {
        this.updateDirectory({
          component: this,
          index: this.index,
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
      this.onSelect([evt, this])
    },
    onSelect (...args) {
      this.$emit('selected', ...args)
    },
    updateDirectory (data) {
      const path = this.absolutePath || this.name
      data.paths = [path, ...data.paths]
      if (!data.parent) {
        // This element is the parent
        data.parent = this
      }
      this.$emit('update-directory', data)
    }
  }
}
</script>

<style src="@/../node_modules/file-icons-js/css/style.css"></style>

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

.arrow {
  display: inline-block;
  margin-right: 5px;
  font-size: 12px;
  width: 12px;
  height: 12px;
}

.icon {
  background-color: inherit !important;
}

.icon::before {
  margin-right: 5px;
  width: 16px;
  font-weight: normal;
  font-style: normal;
  text-alight: center;
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
  font-family: octicons;
  font-size: 16px;
  color: grey;
  top: 1px;
  content: "\f016";
}
</style>
