import ScaffoldCommand from '../../scaffold_base';
import cli from 'cli-ux';

export class Scaffold extends ScaffoldCommand {
    static description = "scaffold vonage demo projects"

    static examples = ['vongae scaffold:vapp --platforms=ios,android --backend=docker']

    async run() {
        const projectData = [
            {
                name: "vapp",
                desc: "iOS, Android and Web projects demoing\nthe Vonage Client SDK's calling and messaging features.",
                usage: "scaffold:vapp"
            }
        ];

        cli.table(projectData, {
            name: {},
            desc: {},
            usage: {}
        })
        this.exit();
    }
}