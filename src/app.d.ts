import type { Database } from 'better-sqlite3'
import Grid from '$lib/grid'

export {}

declare global {

  // SvelteKit App

  namespace App {
    interface Locals {
      db: string
      settings: Settings
    }

    // interface PageData {}
    // interface Error {}
    // interface Platform {}
  }


  // External Modules

  module 'better-sqlite3'
  type Db = typeof Database


  // Enums

  type Guid     = string
  type UnixTime = number
  type Base64   = string


  // Application State

  type Settings = {
  }

  type AppState = {
    myId: Guid
    state: {}
    settings: Settings
  }


  // Domain Objects

  type RgbColor = [number, number, number]  // 0 -> 1

  type Pos = { x: number, y: number }

  type Player = {
    id: Guid
    name: string
    beacon: Pos
  }

  type MemeStats = {
    total: number
    hist: number[]
  }

  type Policy = (clip:Grid) => Grid


  // Database

  type Migration = {
    type: string
    version: number
    name: string
    query?: string
    script?: (db:Db) => Promise<boolean>
  }


  // API

  type PostResult<T> =
    | { error: true, message: string }
    | { error: false, data: T }

}

