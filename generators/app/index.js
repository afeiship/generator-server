"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const glob = require("glob");
const { resolve } = require("path");
const remote = require("yeoman-remote");
const yoHelper = require("@jswork/yeoman-generator-helper");
const replace = require("replace-in-file");

require("@jswork/next-registry-choices");

const TYPES = [
  { name: "Express", value: "express" },
  { name: "Express with https", value: "express-https" }
];

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the stunning ${chalk.red(
          "generator-generator-server"
        )} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "scope",
        message: "Your scope (eg: `babel` )?",
        default: "jswork"
      },
      {
        type: "list",
        name: "registry",
        message: "Your registry",
        choices: nx.RegistryChoices.gets()
      },
      {
        type: "list",
        name: "server_type",
        message: "Your server type",
        choices: TYPES
      },
      {
        type: "input",
        name: "project_name",
        message: "Your project_name (eg: like this `react-button` )?",
        default: yoHelper.discoverRoot
      },
      {
        type: "input",
        name: "description",
        message: "Your description?"
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      yoHelper.rewriteProps(props);
    });
  }

  install() {
    this.npmInstall();
  }

  writing() {
    const done = this.async();
    const { server_type } = this.props;
    remote("afeiship", `boilerplate-${server_type}`, (_, cachePath) => {
      this.fs.copyTpl(
        glob.sync(resolve(cachePath, "{**,.*}")),
        this.destinationPath(),
        this
      );
      done();
    });
  }

  end() {
    const { scope, project_name, description, ProjectName } = this.props;
    const files = glob.sync(resolve(this.destinationPath(), "{**,.*}"));

    replace.sync({
      files,
      from: [
        /boilerplate-server-description/g,
        /boilerplate-server/g,
        /boilerplate-scope/g,
        /GeneratorServer/g
      ],
      to: [description, project_name, scope, ProjectName]
    });
  }
};
