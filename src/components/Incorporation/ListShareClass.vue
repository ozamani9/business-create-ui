<template>
  <div id="list-share-class">
    <section :class="{ 'invalid-section': showErrorSummary }">
      <!-- Summary Warning -->
      <div v-if="isSummary && showErrorSummary" class="share-summary-invalid-message">
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          <span class="error-text mx-1">This step is unfinished.</span>
          <router-link
            id="router-link"
            :to="{ path: `/${RouteNames.INCORPORATION_SHARE_STRUCTURE}` }"
          >Return to this step to finish it</router-link>
        </span>
      </div>

      <v-data-table
        :headers="headers"
        :items="shareClasses"
        disable-pagination
        disable-sort
        hide-default-footer
      >
        <template v-slot:item="row" class="share-data-table">

          <!-- Share Class Rows-->
          <tr :key="row.item.id" class="class-row" :class="{ 'class-row-has-series': row.item.series.length}">
            <td class="list-item__title">{{ row.item.name }}</td>
            <td>{{ row.item.maxNumberOfShares ? (+row.item.maxNumberOfShares).toLocaleString() : 'No Maximum' }}</td>
            <td>{{ row.item.parValue ? row.item.parValue : 'No Par Value' }}</td>
            <td>{{ row.item.currency }}</td>
            <td>{{ row.item.hasRightsOrRestrictions ? 'Yes' : 'No' }}</td>

            <!-- Share Class Edit Btn -->
            <td v-if="!isSummary">
              <div class="actions">
                <span class="edit-action">
                  <v-btn small text color="primary"
                    :id="'class-' + row.index + '-change-btn'"
                    @click="emitShareClass(row.index)"
                    :disabled="componentDisabled"
                  >
                    <v-icon small>mdi-pencil</v-icon>
                    <span>Edit</span>
                  </v-btn>
                </span>

                <!-- Share Class Dropdown Actions -->
                <span>
                  <v-menu offset-y  :disabled="componentDisabled">
                    <template v-slot:activator="{ on }">
                      <v-btn text small
                        color="primary"
                        class="more-actions-btn"
                        v-on="on">
                        <v-icon>mdi-menu-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list class="more-actions">
                      <v-list-item
                        class="actions-dropdown_item"
                        :class="{ 'item-disabled': !row.item.hasRightsOrRestrictions }"
                        :disabled="!row.item.hasRightsOrRestrictions"
                        @click="emitAddSeries(row.index)">
                        <v-list-item-subtitle><v-icon>mdi-playlist-plus</v-icon> Add Series</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item
                        class="actions-dropdown_item"
                        :class="{ 'item-disabled': isMoveDisabled(row.index, 'up') }"
                        @click="moveIndex(row.index, 'up')"
                        :disabled="isMoveDisabled(row.index, 'up')"
                      >
                        <v-list-item-subtitle class="move-up-selector">
                          <v-icon>mdi-arrow-up</v-icon> Move Up
                        </v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item
                        class="actions-dropdown_item"
                        :class="{ 'item-disabled': isMoveDisabled(row.index, 'down') }"
                        @click="moveIndex(row.index, 'down')"
                        :disabled="isMoveDisabled(row.index, 'down')"
                      >
                        <v-list-item-subtitle class="move-down-selector">
                          <v-icon>mdi-arrow-down</v-icon> Move Down
                        </v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item class="actions-dropdown_item" @click="emitRemoveClass(row.index)">
                        <v-list-item-subtitle><v-icon>mdi-delete</v-icon> Remove</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </span>
              </div>
            </td>
          </tr>

          <!-- Share Series rows -->
          <tr v-for="(seriesItem, index) in row.item.series" :key="`class:${row.index}-Series:${index}`"
              class="series-row"
              :class="{ 'series-row-last': index === row.item.series.length - 1}"
          >
            <td class="series-name"><span>{{ seriesItem.name }}</span></td>
            <td>{{ seriesItem.maxNumberOfShares ? (+seriesItem.maxNumberOfShares).toLocaleString()
              : 'No Maximum' }}</td>
            <td>{{ row.item.parValue ? row.item.parValue : 'No Par Value' }}</td>
            <td>{{ row.item.currency }}</td>
            <td>{{ seriesItem.hasRightsOrRestrictions ? 'Yes' : 'No' }}</td>

            <!-- Share Series Edit Btn -->
            <td v-if="!isSummary">
              <div class="actions">
                <span class="edit-action">
                  <v-btn small text color="primary"
                    :id="'series-' + index + '-change-btn'"
                    @click="emitShareSeries(row.index, index)"
                  >
                    <v-icon small>mdi-pencil</v-icon>
                    <span>Edit</span>
                  </v-btn>
                </span>

                <!-- Share Series Dropdown Actions -->
                <span>
                    <v-menu offset-y>
                      <template v-slot:activator="{ on }">
                        <v-btn text small color="primary"
                          class="more-actions-btn" v-on="on"
                        >
                          <v-icon>mdi-menu-down</v-icon>
                        </v-btn>
                      </template>
                      <v-list class="more-actions">
                        <v-list-item
                          class="actions-dropdown_item"
                          :class="{ 'item-disabled': isMoveDisabled(row.index, 'up', index) }"
                          @click="moveIndex(row.index, 'up', index)"
                          :disabled="isMoveDisabled(row.index, 'up', index)"
                        >
                          <v-list-item-subtitle class="move-up-selector">
                            <v-icon>mdi-arrow-up</v-icon> Move Up
                          </v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item
                          class="actions-dropdown_item"
                          :class="{ 'item-disabled': isMoveDisabled(row.index, 'down', index) }"
                          @click="moveIndex(row.index, 'down', index)"
                          :disabled="isMoveDisabled(row.index, 'down', index)"
                        >
                          <v-list-item-subtitle class="move-down-selector">
                            <v-icon>mdi-arrow-down</v-icon> Move Down
                          </v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item class="actions-dropdown_item" @click="emitRemoveSeries(row.index, index)">
                          <v-list-item-subtitle><v-icon>mdi-delete</v-icon> Remove</v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </span>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import 'array.prototype.move'

// Enums
import { RouteNames } from '@/enums'

@Component({})
export default class ListShareClass extends Vue {
  @Prop({ default: () => [] })
  readonly shareClasses: any

  @Prop({ default: false })
  readonly componentDisabled: boolean

  @Prop({ default: false })
  readonly isSummary: boolean

  @Prop({ default: false })
  readonly showErrorSummary: boolean

  // Enum for template
  readonly RouteNames = RouteNames

  private headers: Array<any> = [
    {
      text: 'Name of Share Class or Series',
      align: 'start',
      sortable: false,
      value: 'name'
    },
    { text: 'Maximum Number of Shares', value: 'maxNumberOfShares' },
    { text: 'Par Value', value: 'parValue' },
    { text: 'Currency', value: 'currency' },
    { text: 'Special Rights or Restrictions', value: 'hasRightsOrRestrictions' },
    { text: '', value: 'actions' }
  ]

  /**
   * Adjust the priority of the list share class
   * @param indexFrom The index of the class
   * @param direction The direction of the move
   * @param seriesIndex The index of the series
   */
  private moveIndex (indexFrom: number, direction: string, seriesIndex: number = -1): void {
    let indexTo
    if (seriesIndex >= 0) {
      indexTo = direction === 'up' ? seriesIndex - 1 : seriesIndex + 1
      this.shareClasses[indexFrom].series[seriesIndex].priority = indexTo
      this.shareClasses[indexFrom].series[seriesIndex].priority = indexFrom
      this.shareClasses[indexFrom].series.move(seriesIndex, indexTo)
    } else {
      indexTo = direction === 'up' ? indexFrom - 1 : indexFrom + 1
      this.shareClasses[indexFrom].priority = indexTo
      this.shareClasses[indexTo].priority = indexFrom
      this.shareClasses.move(indexFrom, indexTo)
    }
  }

  /**
   * Determine if the move up / move down is enabled
   * @param index index of the class item
   * @param direction The direction of the move
   * @param seriesIndex index of the series item
   * @returns A boolean indicating if a move is enabled
   */
  private isMoveDisabled (index: number, direction: string, seriesIndex: number = -1): boolean {
    const seriesCheck = seriesIndex >= 0
    const arrBoundry = seriesCheck ? this.shareClasses[index].series.length - 1 : this.shareClasses.length - 1
    switch (direction) {
      case 'up':
        if (seriesCheck) {
          return seriesIndex === 0
        } else {
          return index === 0
        }
      case 'down':
        if (seriesCheck) {
          return seriesIndex === arrBoundry
        } else {
          return index === arrBoundry
        }
      default:
        return false
    }
  }

  /**
   * Emit an index and event to the parent to handle removal.
   * @param index The active index which is subject to removal.
   */
  @Emit('removeClass')
  private emitRemoveClass (index: number): void {}

  /**
   * Emit an index and event to the parent to handle removal.
   * @param index The active index which is subject to removal.
   */
  @Emit('removeSeries')
  private emitRemoveSeries (index: number, seriesIndex: number): void {}

  /**
   * Emit an class and event to the parent to handle editing.
   * @param addSeries The series item to be edited.
   */
  @Emit('addSeries')
  private emitAddSeries (index: number): void {}

  /**
   * Emit an class and event to the parent to handle editing.
   * @param classItem The series item to be edited.
   */
  @Emit('editClass')
  private emitShareClass (index: number): void {}

  /**
   * Emit an  series item and event to the parent to handle editing.
   * @param seriesItem The series item to be edited.
   */
  @Emit('editSeries')
  private emitShareSeries (index: number, seriesIndex: number): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.share-summary-invalid-message {
  padding: 1.25rem;
  color: $app-red;
}

tbody {
  tr:hover {
    background-color: transparent !important;
  }
}

.class-row td:not(:first-child) {
  color: $gray6;
}

.class-row-has-series td {
  border-bottom: none !important;
}

.series-row {
  .series-name {
    padding-left: 2rem;
  }

  td {
    border-bottom: none !important;
  }

  td:not(:first-child){
    color: $gray6;
  }
}

.series-row-last td {
  border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
}

.actions {
  display: flex;

  .edit-action {
    border-right: 1px solid $gray1;
  }

  .v-btn {
    min-width: .5rem;
  }

  .v-btn + .v-btn {
    margin-left: 0.5rem;
  }

  .more-actions-btn {
    width: 28px;
  }
}

.more-actions {
  padding: 2px 0;

  .item-disabled {
    opacity: .5;
  }

  .actions-dropdown_item {
    min-height: 0!important;
    margin: 1rem 0;
  }
}

.v-icon.mdi-information-outline {
  margin-top: -2px;
}
</style>
