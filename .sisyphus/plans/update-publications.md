# Update Publication Selection Rules

## TL;DR

Update all publication files to follow the new selection rules:
1. Only first-author or co-first author papers should be `selected: true`
2. Only first-author papers that are accepted (not under review) should be `pinned: true`
3. Under review papers should only be `selected`, not `pinned`

## Context

User wants to reorganize the publication display on the homepage based on authorship position and publication status.

### Current State
- Many papers have `selected: true` regardless of authorship position
- Some under-review papers are pinned
- Need to clean up to show only first-author/co-first work

### Target State

**Should be SELECTED (first-author or co-first):**
- 2026: TS-Memory (co-first), DropoutTS (first), OmniAir (co-first), FactoST (first)
- 2025: FactoST (first), TimeVLM (first), MM4ST (first)
- 2024: UrbanCross (first)

**Should be PINNED (first-author AND accepted):**
- 2025: FactoST, TimeVLM, MM4ST
- 2024: UrbanCross

**Should NOT be selected (not first-author):**
- 2025: UrbanVLP, OccamVTS, DeepUHI, AirRadar, MMLoad, STUM, LDM4TS
- 2024: UrbanCLIP, STFNN, SINPA, STGormer

## Work Objectives

### Core Objective
Update 13 publication markdown files to reflect correct `selected` and `pinned` status based on authorship rules.

### Concrete Deliverables
- Modified publication files with correct metadata

### Must Have
- All under-review papers unpinned
- Only first-author/co-first papers selected
- Only accepted first-author papers pinned

## TODOs

- [x] 1. Update 2026 papers - Remove pinned from under-review papers
  - TS-Memory: pinned: true → false
  - DropoutTS: pinned: true → false
  - OmniAir: pinned: true → false
  - FactoST: pinned: true → false

- [x] 2. Update 2025 papers - Remove selected from non-first-author papers
  - UrbanVLP: selected: true → false
  - OccamVTS: selected: true → false
  - DeepUHI: selected: true → false
  - AirRadar: selected: true → false
  - MMLoad: selected: true → false
  - STUM: selected: true → false

- [x] 3. Update 2024 papers - Remove selected from non-first-author papers
  - UrbanCLIP: selected: true → false
  - STFNN: selected: true → false
  - SINPA: selected: true → false

## Verification Strategy

After all edits, verify by checking:
1. Count of selected papers should be 8 (4 under-review + 4 accepted)
2. Count of pinned papers should be 4 (only accepted first-author)
3. No under-review paper should have pinned: true

## Success Criteria

```bash
# Count selected papers
grep -l "selected: true" _publications/*/*.md | wc -l
# Expected: 8

# Count pinned papers  
grep -l "pinned: true" _publications/*/*.md | wc -l
# Expected: 4

# Verify no under-review papers are pinned
grep -B2 "pinned: true" _publications/*/*.md | grep -i "under review"
# Expected: 0 matches
```
