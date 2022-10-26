/** @returns {Promise<import('jest').Config>} */
module.exports = async () => {
    return {
        verbose: true,
        coverageThreshold: {
            global: {
              branches: 80,
              functions: 80,
              lines: 80,
              statements: -10,
            },
          }, 
    };
};