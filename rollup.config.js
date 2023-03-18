// import { rollup } from 'rollup';
// import resolve from "@rollup/plugin-node-resolve"
// const { terser } = require("rollup-plugin-terser")
import terser from '@rollup/plugin-terser';
// import { createPathTransform } from 'rollup-sourcemap-path-transform'
// import dts from "rollup-plugin-dts";

module.exports={
    input: "./index.js",
    output: [{
        file: "./dist/rimaxState.min.js", format: "es", name: "RimaxState", plugins: [terser()], sourcemap: true
    },{
        file: "./dist/rimaxState.js", format: "es", name: "RimaxState", sourcemap: true
    }],
    plugins: [],
} 