import { expect, test } from '@oclif/test'

describe('scaffold:vapp', () => {
    test
    .stdout()
    .command(['scaffold'])
    .exit(2)
    .it('Running scaffold does nothing')

    test
    .stderr()
    .command(['scaffold:vapp'])
    .catch(ctx => {
        expect(ctx.message).to.contain('Missing required flag')
    })
    .it('Running scaffold:vapp without a flags fails gracefully')

    test
    .stderr()
    .command(['scaffold:vapp', '--platforms'])
    .catch(ctx => {
        expect(ctx.message).to.contains('Flag --platforms expects a value')
    })
    .it('Running scaffold:vapp without platform value fails gracefully')

    test
    .stderr()
    .command(['scaffold:vapp', '--backend'])
    .catch(ctx => {
        expect(ctx.message).to.contains('Flag --backend expects a value')
    })
    .it('Running scaffold:vapp without backend value fails gracefully')

    test
    .stderr()
    .command(['scaffold:vapp', '--platforms=iOS'])
    .catch(ctx => {
        expect(ctx.message).to.contains('Missing required flag')
    })
    .it('Running scaffold:vapp without backend flag fails gracefully')

    test
    .stderr()
    .command(['scaffold:vapp', '--backend=skip'])
    .catch(ctx => {
        expect(ctx.message).to.contains('Missing required flag')
    })
    .it('Running scaffold:vapp without platform flag fails gracefully')
});