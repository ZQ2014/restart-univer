import { Inject, Injector, Plugin, UniverInstanceType } from "@univerjs/core";

/**
 * A simple Plugin example, show how to write a plugin.
 */
class FirstPlugin extends Plugin {
  static override type = UniverInstanceType.UNIVER_SHEET;
  static override pluginName = "first-plugin";

  constructor(
    // inject injector, required
    @Inject(Injector) override readonly _injector: Injector
  ) {
    super();
    console.log("FirstPlugin:constructor");
  }

  override onStarting(): void {
    console.log("FirstPlugin:onStarting");
  }

  override onReady(): void {
    console.log("FirstPlugin:onReady");
  }

  override onRendered(): void {
    console.log("FirstPlugin:onRendered");
  }

  override onSteady(): void {
    console.log("FirstPlugin:onSteady");
  }
}

export default FirstPlugin;
